import mondaySdk from "monday-sdk-js";
import { MONDAYTOKEN } from "./config.mjs";
const monday = mondaySdk();
monday.setApiVersion("2023-10");
monday.setToken(MONDAYTOKEN);

export async function lambdaHandler(event) {
  let resMessage = JSON.parse(event.body);
  console.log(
    "🚀 ~ file: lambdaHandler.mjs:3 ~ lambdaHandler ~ resMessage:",
    resMessage
  );
  let column_values = JSON.stringify({
    connect_boards: {
      item_ids: [parseInt(resMessage.event.columnValues.short_text1.value)],
    },
  });
  console.log(
    `mutation {change_multiple_column_values(item_id: ${
      resMessage.event.pulseId
    }, board_id: ${resMessage.event.boardId}, column_values: "${JSON.stringify(
      column_values
    )}" ) { id }}`
  );

  return monday
    .api(
      `mutation {change_multiple_column_values(item_id: ${
        resMessage.event.pulseId
      }, board_id: ${resMessage.event.boardId}, column_values: ${JSON.stringify(
        column_values
      )} ) { id }}`
    )
    .then((res) => {
      console.log(res);
      const response = {
        statusCode: 200,
        body: resMessage,
      };
      return response;
    });
}
