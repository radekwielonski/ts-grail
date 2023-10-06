import { AwsGrailStack } from "./aws";

export enum CloudProviders {
  AWS = "aws",
}

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
  PATCH = "PATCH",
}

export class RestApiTrigger {
  public path: string;
  public method: HttpMethods;
  constructor(path: string, method: HttpMethods) {
    this.path = path;
    this.method = method;
  }
}

export abstract class ServerlessFunction {
  abstract trigger: RestApiTrigger; // To be extended by other services
  abstract handler: Function;
}

export class GrailStack {
  constructor(
    stackName: string,
    cloudProvider: CloudProviders,
    resources: ServerlessFunction[], // To be extended by other services
    props: object
  ) {
    if (cloudProvider === CloudProviders.AWS) {
      new AwsGrailStack(stackName, resources, props);
    } else {
      console.log("Other cloud providers are not implemented");
    }
  }
}
