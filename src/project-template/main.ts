import {
  GrailStack,
  RestApiTrigger,
  ServerlessFunction,
  CloudProviders,
  HttpMethods,
} from "ts-grail";

class GetProducts extends ServerlessFunction {
  // Specyfing the type of trigger and it's properties
  trigger = new RestApiTrigger("/products", HttpMethods.GET);

  // environment variables
  environment = { key: "value" };

  // Name of folder containing the handler file
  folderName = "functions";

  // Name of file with the logic and the handler name
  handlerName = "handler.handler";
}

// gathering all resources
export const resources = [new GetProducts()];

// Creation of the stack
new GrailStack("GrailStack", CloudProviders.AWS, resources, {});
