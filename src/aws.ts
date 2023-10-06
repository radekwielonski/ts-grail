import * as cdk from "aws-cdk-lib";
import {
  aws_apigateway as apiGateway,
  aws_lambda as lambda,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { RestApiGateway, RestApiTrigger, ServerlessFunction } from "./ts-grail";

let awsRestApiSingleton: AwsRestApiGateway;

export class AwsRestApiFactory {
  public static getAwsInstance(
    scope: Construct,
    id: string
  ): AwsRestApiGateway {
    if (!awsRestApiSingleton) {
      awsRestApiSingleton = new AwsRestApiGateway(scope, id);
    }
    return awsRestApiSingleton;
  }
}

export class AwsRestApiGateway extends RestApiGateway {
  awsRestApiGatewayConstruct: AwsRestApiGatewayConstruct;
  constructor(scope: Construct, id: string) {
    super();
    this.awsRestApiGatewayConstruct = new AwsRestApiGatewayConstruct(
      scope,
      `${id}-api`
    );
  }
}
export class AwsRestApiGatewayConstruct extends Construct {
  public readonly gateway: apiGateway.LambdaRestApi;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.gateway = new apiGateway.RestApi(this, `${id}-restApi`);
  }

  public createResourcesFor(path: string) {
    const pathParts = path.split("/");
    if (pathParts[0] === "") {
      pathParts.shift();
    }
    return this.createResource(pathParts, 0, this.gateway.root);
  }

  private createResource(
    pathParts: string[],
    index: number,
    resource: apiGateway.IResource
  ): apiGateway.IResource {
    const pathPart = pathParts[index];

    const existingResource = resource.getResource(pathPart);
    const resultingResource = existingResource
      ? existingResource
      : resource.addResource(pathPart);

    if (index !== pathParts.length - 1) {
      return this.createResource(pathParts, index + 1, resultingResource);
    }

    return resultingResource;
  }
}

class LambdaHandler extends Construct {
  public readonly handler: lambda.Function;
  constructor(
    scope: Construct,
    id: string,
    serverlessFunction: ServerlessFunction
  ) {
    super(scope, `${id}-${serverlessFunction.constructor.name}`);
    this.handler = new lambda.Function(
      this,
      `${id}-${serverlessFunction.constructor.name}`,
      {
        functionName: `${id}-${serverlessFunction.constructor.name}`,
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromInline(
          `exports.handler = ${serverlessFunction.handler.toString()}`
        ),
        handler: "index.handler",
      }
    );
    if (serverlessFunction.trigger) {
      if (serverlessFunction.trigger instanceof RestApiTrigger) {
        const restApi = AwsRestApiFactory.getAwsInstance(scope, id);
        const lambdaIntegration = new apiGateway.LambdaIntegration(
          this.handler,
          {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' },
          }
        );
        const pathResource =
          restApi.awsRestApiGatewayConstruct.createResourcesFor(
            serverlessFunction.trigger.path
          );
        pathResource.addMethod(
          serverlessFunction.trigger.method,
          lambdaIntegration
        );
      }
    }
  }
}

export class AwsGrailStack extends cdk.Stack {
  public app: cdk.App;
  constructor(id: string, resources: any, props?: cdk.StackProps) {
    const app = new cdk.App();
    super(app, id, props);

    for (const resource of resources) {
      if (resource instanceof ServerlessFunction) {
        new LambdaHandler(this, id, resource);
      }
    }
  }
}
