
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'rkitch815',
  applicationName: 'bcmondayv2',
  appUid: 'undefined',
  orgUid: '0b549d6d-e92c-480c-abef-589f71f3ca4c',
  deploymentUid: '08174410-e9ff-4ec7-b13b-84acef8e2d3f',
  serviceName: 'bcmondayv2',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '6.2.3',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'bcmondayv2-dev-function1', timeout: 15 };

try {
  const userHandler = require('./index.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}