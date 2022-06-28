import fs from 'fs';
import {
  Toolbox,
} from 'subito-lib';
import type { ILogger } from 'subito-lib';
import SecurityError from '../errors/SecurityError';
import Rights from './Rights';
import defaultPolicies from './defaultPolicies';
import e from '../security/env';

type Group = { name: string, roles: string[] }
type Apps = { [appName: string]: string[] }
type ErrorId = { [name: string]: number }

export interface IABAC {
  anyone: Function
  admin: Function
  guest: Function
  addPolicy: Function
}

type CodeError = string | null
type Basic = { [name: string]: any }
export type Namespace = string
export type ResourceName = string
export type Gateway = string
export type Config = {
  apps?: string[],
  envs?: string[],
  map?: [viewerField: string, sourceField: string]
  gateways?: Gateway[]
}
export type Resource = ResourceName | { resource: string, config: Config}
export type Policy = { [group: string]: Config }
export type Policies<P = Policy> = { [resource: string]: P }
export type AppName = string
export type GroupName = string
export type Document = Basic
export type Entity = Document & { get(field: string): Function }
export type Viewer = Basic & { roles: string[] }
export type Context = Basic & { viewer?: Viewer, gateway: Gateway, app: Basic }
export type Source = Document | Entity
export type Params = { source: Source, args: Basic, info: Basic, context: Context}

/**
 * @alpha
 */
class ABAC implements IABAC {
  private policies: Policies = {};

  private defaultPolicies: Policies<Function> = defaultPolicies();

  private gateway: Gateway | null = null;

  private viewerData?: Viewer;

  private logger: ILogger | null = null;

  // private context: Context | null = null;

  private viewerIs: Basic = { anyone: true };

  private appData: Basic | null = null;

  private isDev: boolean = false;

  private groups: Group[] = [
    { name: 'admin', roles: ['ADMIN', 'ADMIN_DEV'] },
    { name: 'dev', roles: ['ADMIN_DEV', 'ADMIN_DEV_LEAD', 'ADMIN_DEV_CTO'] },
  ];

  private apps: Apps = {
    bo: ['APP_BO'],
    client: ['APP_CLIENT'],
    front: ['APP_FRONT'],
    service: ['APP_SERVICE'],
  };

  private errorId: ErrorId = {
    anyone: 0,
    guest: 1,
    member: 2,
    admin: 3,
  };

  addDefaultPolicies(policies: Function) {
    this.defaultPolicies = { ...this.defaultPolicies, ...policies() };
    return this;
  }

  addGroups(groups: Group[]) {
    this.groups = [...this.groups, ...groups];
  }

  addApps(apps: Apps) {
    this.apps = { ...this.apps, ...apps };
  }

  setLogger(logger: ILogger) {
    this.logger = logger;
    return this;
  }

  // apply({ policy, namespace, resources }) {
  //   if (this.defaultPolicies[policy]) {
  //     return this.defaultPolicies[policy](
  //       this,
  //       namespace,
  //       resources,
  //     );
  //   }
  //   throw new SecurityError('Bad ABAC policy.', 'ERR-250', this.context);
  // }

  async loadFromPath(root: string, path: string) {
    const files = fs.readdirSync(`${root}/${path}`);
    await Toolbox.asyncForEach(files, async (file: string) => {
      if (file !== 'plugin') {
        let namespace = file.replace(/^(.*)ABAC\/, '$1');
        namespace = namespace.charAt(0).toUpperCase() + namespace.substring(1);
        const { default: fn } = await import(`${root}/${path}${file}`);
        fn(this, namespace);
      }
    });

    return true;
  }

  async load(root: string, paths: string | string[]) {
    try {
      if (Array.isArray(paths)) {
        await Toolbox.asyncForEach<string>(paths, async (path: string) => {
          await this.loadFromPath(root, path);
        });
      } else {
        await this.loadFromPath(root, paths);
      }
    } catch (err: unknown) {
      if (this.logger && typeof err === 'string') {
        this.logger.newError('INT_500', err, { root, paths });
      } else {
        console.log(err); // eslint-disable-line no-console
      }
    }
    return this;
  }

  isInGroup(group: Group) {
    if (this.viewerData) {
      const { roles } = this.viewerData;
      return (Toolbox.intersection(roles, group.roles).length > 0);
    }

    return false;
  }

  isApp(app: AppName) {
    if (this.appData) {
      const { roles } = this.appData;
      return (Toolbox.intersection(roles, this.apps[app]).length > 0);
    }

    return false;
  }

  init(context: Context) {
    // this.context = context;
    const { gateway, viewer, app } = context;
    this.gateway = gateway;
    this.viewerData = viewer;
    this.appData = app;
    this.viewerIs = { anyone: true };
    if (this.viewerData) {
      this.viewerIs.member = true;
      if (!this.viewerData.roles) {
        this.viewerData.roles = [];
      }
      this.groups.forEach((group) => {
        this.viewerIs[group.name] = this.isInGroup(group);
      });
    } else {
      this.viewerIs.guest = true;
    }

    return this;
  }

  group(group: GroupName, config = {}) {
    return new Rights(this, { group, config });
  }

  admin(config = {}) {
    return this.group('admin', config);
  }

  anyone(config = {}) {
    return this.group('anyone', config);
  }

  guest(config = {}) {
    return this.group('guest', config);
  }

  member(config = {}) {
    return this.group('member', config);
  }

  addPolicy(resource: string, policy: Policy) {
    const base = this.policies[resource] ?? {};
    this.policies[resource] = { ...base, ...policy };
  }

  bypass(resource: Resource, err: CodeError) {
    if (this.isDev || e.APP_ENV === 'local') {
      if (this.logger) {
        this.logger.newError(err, `‼️  ABAC.verify('${resource}') bypass by a dev account.
‼️  Change your account to test the access rights.`);
      } else {
        /* eslint-disable no-console */
        console.log('');
        console.log(`‼️  ${err}`);
        console.log(`‼️  ABAC.verify('${resource}') bypass by a dev account.`);
        console.log('‼️  Change your account to test the access rights.');
        console.log('');
        /* eslint-enable no-console */
      }

      return true;
    }

    return false;
  }

  verifyGroupAccess(
    policy: Policy,
    group: GroupName,
    resource: ResourceName,
    { source, context: { viewer } }: Params,
  ) {
    const rules = policy[group];

    if (!rules) {
      return { access: false };
    }

    const envs = rules.envs ?? null;
    // Active policy only on certains envs
    if (!envs || (envs && envs.includes(e.APP_ENV))) {
      const errorId = this.errorId[group] ?? 9;
      const { map } = rules;
      if (map) {
        if (!viewer) {
          return { access: false, err: `ERR-34${errorId}` };
        }

        const [viewerField, sourceField] = map;
        const viewerValue = viewer[viewerField];
        if (Array.isArray(sourceField)) {
          const sourceValues = sourceField.map((field) => {
            if (source.isDavidgsEntity) {
              return source.get(field);
            }
            return source[field];
          });
          if (!sourceValues.includes(viewerValue)) {
            return { access: false, err: `ERR-34${errorId}` };
          }
        } else {
          let sourceValue = source[sourceField];
          if (source.isDavidgsEntity) {
            sourceValue = source.get(sourceField);
          }
          if (viewerValue !== sourceValue) {
            return { access: false, err: `ERR-34${errorId}` };
          }
        }
      }

      if (!this.viewerIs[group] && !map) {
        return { access: false };
      }

      // App optional
      const { apps } = rules;
      if (apps) {
        let pass = false;
        apps.forEach((app) => {
          if (!this.apps[app]) {
            this.throw(resource, 'ERR-251');
          }
          if (this.isApp(app)) {
            pass = true;
          }
        });
        if (!pass) {
          return { access: false, err: `ERR-33${errorId}` };
        }
      }
      // Gateway mandatory
      const gateways = rules.gateways ?? [];
      if (this.gateway && !gateways.includes(this.gateway)) {
        return { access: false, err: `ERR-32${errorId}` };
      }

      // This group has access to the resource
      return { access: true };
    }

    return { access: false };
  }

  verify(resource: ResourceName, params: Params) { // eslint-disable-line consistent-return
    const policy = this.policies?.[resource] || null;
    if (!policy) {
      this.throw(resource, 'ERR-210');
    }

    let access = false;
    let err:CodeError = null;
    ['anyone', 'guest', 'member'].every((group) => {
      const { access: groupAccess, err: groupErr } = this.verifyGroupAccess(policy, group, resource, params); // eslint-disable-line max-len
      if (groupAccess) {
        access = true;
        return false;
      } if (!err && groupErr) {
        err = groupErr;
      }
      return true;
    });
    if (access) {
      return true;
    }

    this.groups.every((group) => {
      const { access: groupAccess, err: groupErr } = this.verifyGroupAccess(policy, group.name, resource, params); // eslint-disable-line max-len
      if (groupAccess) {
        access = true;
        return false;
      } if (!err && groupErr) {
        err = groupErr;
      }
      return true;
    });
    if (access) {
      return true;
    }

    this.throw(
      resource,
      err || 'ERR-999',
    );
  }

  throw(resource: ResourceName, err: CodeError) {
    if (this.bypass(resource, err)) {
      return true;
    }
    throw new SecurityError('You are is not authorized to perform this request.', err || 'ABAC_UNKNOWN');
  }
}

export default ABAC;
