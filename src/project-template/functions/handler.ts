import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

exports.handler = async (
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
