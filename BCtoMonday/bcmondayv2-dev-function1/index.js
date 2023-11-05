module.exports.handler = async (event, context) => {
  const { lambdaHandler } = await import("./index.mjs");
  return lambdaHandler(event, context);
};
