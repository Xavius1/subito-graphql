import type { IABAC, Namespace, Resource } from './ABAC.js';

const anyone = function anyonePolicies(abac: IABAC, namespace: Namespace, resources: Resource) {
  return abac
    .anyone()
    .allowResource(namespace, resources)
    .throughGateway(['client'])
    .push()

    .admin()
    .allowResource(namespace, resources)
    .throughGateway(['client', 'server'])
    .push();
};

const guest = function guestPolicies(abac: IABAC, namespace: Namespace, resources: Resource) {
  return abac
    .guest()
    .allowResource(namespace, resources)
    .throughGateway(['client'])
    .push()

    .admin()
    .allowResource(namespace, resources)
    .throughGateway(['client', 'server'])
    .push();
};

const admin = function adminPolicies(abac: IABAC, namespace: Namespace, resources: Resource) {
  return abac
    .admin()
    .allowResource(namespace, resources)
    .throughGateway(['client', 'server'])
    .push();
};

const defaultPolicies = function defaultPolicies() {
  return {
    'anyone-basic': anyone,
    'guest-basic': guest,
    'admin-basic': admin,
  };
};

export default defaultPolicies;
