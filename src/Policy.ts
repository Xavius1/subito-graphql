enum Scope {
  public = 1, // Anyone
  guest = 100, // Only logged out users
  protected = 200, // Only logged in users
  private = 300, // Custom validations
  owner = 400, // Only current viewer
}

interface IPolicy {
  scope: Scope
  extends: Function
}

class Policy implements IPolicy {
  scope;

  extentions;

  constructor(scope: Scope) {
    this.scope = scope;
  }

  dependsOn(query): Boolean { // another policy
    return res;
  }
}

export default Policy;
