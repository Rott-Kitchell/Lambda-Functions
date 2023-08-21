module.exports.handler = async (event, context) => {
  console.log("🚀 ~ file: index.js:2 ~ exports.handler= ~ event:", event);
  const { lambdaHandler } = await import("./index.mjs");
  return lambdaHandler(event, context);
};
