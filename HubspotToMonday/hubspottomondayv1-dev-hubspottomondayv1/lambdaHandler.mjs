import { Client } from "@hubspot/api-client";
import sendToMonday from "./utils/sendToMonday.mjs";
import priortityCalculator from "./utils/priorityCalc.mjs";
import { HUBSPOTTOKEN, MONDAYNETNEWBOARDID } from "./config.mjs";
const hubspotClient = new Client({ accessToken: HUBSPOTTOKEN });
let query =
  "mutation ($boardId: Int!, $itemName: String!, $columnValues: JSON!){create_item (board_id: $boardId, item_name: $itemName, create_labels_if_missing: true, column_values: $columnValues) {id}}";

export async function lambdaHandler(event) {
  // TODO implement
  console.log("Received webhook data: ", event.body);
  let {
    dealname,
    deployment_engineer,
    account_manager,
    onboarding_manager,
    account_executive,
    closedate,
    sotd,
    state,
    operation_type,
    service_model,
    ...therest
  } = JSON.parse(event.body);

  let team = {
    deployment_engineer,
    account_manager,
    onboarding_manager,
    account_executive,
  };

  for (let person in team) {
    if (team[person] !== null) {
      try {
        let personData = await hubspotClient.crm.owners.ownersApi.getById(
          team[person]
        );
        team[person] = personData.email;
      } catch (err) {
        console.log(err);
        team[person] = null;
      }
    }
  }
  console.log("🚀 ~ file: lambdaHandler.mjs:25 ~ lambdaHandler ~ team:", team);
  console.log(
    "🚀 ~ file: lambdaHandler.mjs:59 ~ lambdaHandler ~ service_model.split(';'):",
    service_model ? service_model.split(";") : null
  );
  let priority = priortityCalculator(therest);

  let resMessage = await sendToMonday(query, {
    boardId: parseInt(MONDAYNETNEWBOARDID),
    itemName: dealname,
    columnValues: JSON.stringify({
      deployment_engineer: team.deployment_engineer,
      account_manager: team.account_manager,
      onboarding_manager: team.onboarding_manager,
      account_executive: team.account_executive,
      service_model: {
        labels: service_model ? service_model.split(";") : null,
      },
      operation_type: {
        labels: operation_type,
      },
      priority: {
        label: priority,
      },
      sotd,
      state,
    }),
  });

  const response = {
    statusCode: 200,
    body: resMessage,
  };
  return response;
}
