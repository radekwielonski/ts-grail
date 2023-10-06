# Welcome to TS Grail

TS Grail is micro framework invented for building simple serverless applications fast.
I want to make applications cloud agnostic as much as possible. So once written application should be deployable easily to all hyperscaler cloud providers.

The purpose of this package is to also be able develop apps locally without need of deployment during the development.

## Quick start

### Overview

I wanted to make sure there will be as little of boilerplate as possible so I came up with that solution:

```ts
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
```

### Create project structure

```sh
npx ts-grail --init
```

After that you should see basic structure created, and first example shown in main.ts

### Deploy resources to AWS

```sh
ts-grail deploy aws
```

or

```sh
ts-grail deploy aws --profile name-of-the-profile
```

or in case of AWS you can use cdk command:

```sh
cdk deploy --app "npx ts-node --prefer-ts-exts main.ts" --profile name-of-the-profile
```
