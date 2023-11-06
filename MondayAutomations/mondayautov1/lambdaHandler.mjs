export async function lambdaHandler(event) {
  let resMessage = JSON.parse(event.body);
  console.log(
    "🚀 ~ file: lambdaHandler.mjs:3 ~ lambdaHandler ~ resMessage:",
    resMessage
  );

  console.log(
    "🚀 ~ file: lambdaHandler.mjs:6 ~ lambdaHandler ~ resMessage.event:",
    resMessage.event
  );
  const response = {
    statusCode: 200,
    body: resMessage,
  };
  return response;
}
