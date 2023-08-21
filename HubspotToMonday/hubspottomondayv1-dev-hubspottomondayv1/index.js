module.exports.handler = async (event) => {
  const { lambdaHandler } = await import("./lambdaHandler.mjs");
  return lambdaHandler(event);
};
