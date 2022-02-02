import SecurityError from '../errors/SecurityError.js';
import type {
  IABAC, Gateway, Namespace, Resource, GroupName,
} from './ABAC.js';

type config = { [key: string]: any}

class Rights {
  private abac: IABAC;

  private namespace?: Namespace;

  private resources: Resource[] = [];

  private group: GroupName;

  private config;

  constructor(abac: IABAC, { group, config = {} }: { group: GroupName, config: config }) {
    this.abac = abac;
    this.group = group;
    this.config = config;
  }

  allowResource(namespace: Namespace, resources: Resource | Resource[]) {
    this.namespace = namespace;
    this.resources = Array.isArray(resources) ? resources : [resources];
    return this;
  }

  throughGateway(gateways: Gateway | Gateway[]) {
    this.config.gateways = Array.isArray(gateways) ? gateways : [gateways];
    return this;
  }

  withApp(apps: string | string[]) {
    this.config.apps = Array.isArray(apps) ? apps : [apps];
    return this;
  }

  withEnv(envs: string | string[]) {
    this.config.envs = Array.isArray(envs) ? envs : [envs];
    return this;
  }

  batch() {
    if (Array.isArray(this.resources)) {
      this.resources.forEach((resources) => {
        this.addPolicy(resources);
      });
    } else {
      this.addPolicy(this.resources);
    }
  }

  compose(resource: Resource) {
    if (typeof resource === 'string') {
      return { name: resource, config: this.config };
    }
    const { resource: name, config } = resource;
    if (!name || typeof name !== 'string') {
      throw new SecurityError('Bad ABAC policy.', 'ERR-201');
    }
    return { name, config: { ...this.config, ...config } };
  }

  addPolicy(resource: Resource) {
    const gateways = this.config.gateways ?? [];
    if (!Array.isArray(gateways) || gateways.length === 0) {
      throw new SecurityError('Bad ABAC policy.', 'ERR-220');
    }
    const { name, config } = this.compose(resource);
    this.abac.addPolicy(
      `${this.namespace}.${name}`,
      { [this.group]: config },
    );
  }

  commit() {
    this.batch();
    return this;
  }

  push() {
    this.batch();
    return this.abac;
  }
}

export default Rights;
