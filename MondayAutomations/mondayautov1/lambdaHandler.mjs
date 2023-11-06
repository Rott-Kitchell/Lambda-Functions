export async function lambdaHandler(event) {
  let resMessage = JSON.parse(event.body);

  console.log(
    "🚀 ~ file: lambdaHandler.mjs:4 ~ lambdaHandler ~ event.body:",
    JSON.parse(event.body)
  );
  const response = {
    statusCode: 200,
    body: resMessage,
  };
  return response;
}
