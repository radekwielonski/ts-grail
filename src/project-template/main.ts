import {
  GrailStack,
  RestApiTrigger,
  ServerlessFunction,
  CloudProviders,
  HttpMethods,
} from "ts-grail";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

class GetProducts extends ServerlessFunction {
  // Specyfing the type of trigger and it's properties
  trigger = new RestApiTrigger("/products", HttpMethods.GET);

  // environment variables
  environment = { key: "value" };

  // Defining the logic
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

// gathering all resources
export const resources = [new GetProducts()];

// Creation of the stack
new GrailStack("GrailStack", CloudProviders.AWS, resources, {});
