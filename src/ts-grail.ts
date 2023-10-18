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

export interface RestResponse {
  statusCode: number;
  headers?: { [header: string]: boolean | number | string } | undefined;
  body: string;
}

export class RestApiTrigger {
  /**
   * Defines relative path of the endpoint e.g '/products'
   */
  public path: string;
  /**
   * Defines method of the endpoint e.g 'GET'
   */
  public method: HttpMethods;
  constructor(path: string, method: HttpMethods) {
    this.path = path;
    this.method = method;
  }
}

export abstract class ServerlessFunction {
  /**
   * Defines environment variables for the Function
   */
  abstract environment?: { [key: string]: string };
  /**
   * Defines trigger of the function e.g. Rest API, queue or cron
   */
  abstract trigger: RestApiTrigger; // To be extended by other services
  /**
   * Definition of the function, the main logic
   */
  abstract handler: Function;
}

/**
 * A root construct which represents a single Cloud stack, it will create specific cloud stack based on @param cloudProvider
 * You can have multiple stacks in your application
 */
export class GrailStack {
  /**
   * Constructor of the stack class
   * @param stackName defines the name of the whole stack and also a prefix for resources names
   * @param cloudProvider defines what cloud we want to use
   * @param resources defines all the resources which we want to create in this stack
   * @param props defines additional props which you want to pass to the cloud stack creation. Can be different for different Cloud Providers.
   */
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
