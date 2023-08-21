import sendToMonday from "./sendToMonday.mjs";
import { MONDAYORDERBOARDID } from "../config.mjs";

export default function doesItemExistMonday(orderId) {
  let query =
    'query ($orderId: String!, $boardId: Int!) { items_by_column_values (board_id: $boardId, column_id: "dup__of_order__", column_value: $orderId) { id, name, updated_at, column_values{ id, text, value }, subitems{ id, board{ id }, name, column_values{ id, text } } } }';
  let vars = {
    boardId: parseInt(MONDAYORDERBOARDID),
    orderId: orderId.toString(),
  };
  // query that checks if an item with the orderId exists in Monday and returns the item if it exist
  return sendToMonday(query, vars);
}
