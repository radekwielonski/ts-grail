import {
  GrailStack,
  RestApiTrigger,
  ServerlessFunction,
  CloudProviders,
  HttpMethods,
} from "ts-grail";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

class GetProducts extends ServerlessFunction {
  trigger = new RestApiTrigger("/some-endpoint", HttpMethods.GET);
  handler = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    console.log("ts-grail log!");
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hello from ts-grail!",
      }),
    };
  };
}

export const resources = [new GetProducts()];

new GrailStack("GrailStack", CloudProviders.AWS, resources, {});
