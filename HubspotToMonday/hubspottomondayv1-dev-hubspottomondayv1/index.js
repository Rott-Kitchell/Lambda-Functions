module.exports.handler = async (event) => {
  console.log(
    "🚀 ~ file: index.js:2 ~ module.exports.handler= ~ event:",
    event
  );
  const { lambdaHandler } = await import("./lambdaHandler.mjs");
  return lambdaHandler(event);
};
