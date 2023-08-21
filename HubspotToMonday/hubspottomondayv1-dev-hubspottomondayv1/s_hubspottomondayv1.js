
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'rkitch815',
  applicationName: 'hubspottomondayv1',
  appUid: 'undefined',
  orgUid: '0b549d6d-e92c-480c-abef-589f71f3ca4c',
  deploymentUid: 'bbf30638-5c24-49fe-8ad9-f2e40a612230',
  serviceName: 'hubspottomondayv1',
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

const handlerWrapperArgs = { functionName: 'hubspottomondayv1-dev-hubspottomondayv1', timeout: 15 };

try {
  const userHandler = require('./index.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}