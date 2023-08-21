import { MONDAYORDERBOARDID } from "../config.mjs";
import doesItemExistInMonday from "../utils/doesItemExistInMonday.mjs";
import compareAndMerge from "../utils/compareAndMerge.mjs";
import sendToMonday from "../utils/sendToMonday.mjs";

export async function FromBCToMonday(
  orderId,
  status,
  contact,
  dateCreated,
  dateModified,
  { shipping_method, ...shippingInfo } = shippingInfo,
  mergedProducts,
  staffNotes,
  customerMessage
) {
  let message = "";
  let address = [
    shippingInfo.full_name,
    shippingInfo.company,
    shippingInfo.street_1,
    shippingInfo.street_2,
    shippingInfo.city,
    shippingInfo.state,
    shippingInfo.zip,
    shippingInfo.county,
  ]
    .filter((el) => el != "")
    .join(" ");
  let vars = {
    boardId: parseInt(MONDAYORDERBOARDID),
    myItemName: `Order #${orderId} - ${
      contact.company !== "" ? contact.company : contact.full_name
    }`,
    columnVals: JSON.stringify({
      dup__of_order__: orderId,
      status: status,
      date4: {
        date: dateCreated.dateCreatedDate,
        time: dateCreated.dateCreatedTime,
      },
      text7: contact.company,
      shipping_address8: address,
      text58: shipping_method,
      text6: staffNotes,
      text0: contact.full_name,
      text3: customerMessage,
      date0: {
        date: dateModified.dateModifiedDate,
        time: dateModified.dateModifiedTime,
      },
    }),
  };
  let doesItExist = await doesItemExistInMonday(orderId);
  if (!doesItExist.data.items_by_column_values[0]) {
    console.log(orderId + " does not exist");
    let query =
      "mutation ($boardId: Int!, $myItemName: String!, $columnVals: JSON!){ create_item (board_id:$boardId, item_name:$myItemName, column_values:$columnVals) { id } }";

    return sendToMonday(query, vars)
      .then(
        async ({
          data: {
            create_item: { id },
          },
        }) => {
          await Promise.all(
            mergedProducts.map(async (prod) => {
              let prodQuery =
                "mutation ($parentItemID: Int!, $myItemName: String!, $columnVals: JSON!){ create_subitem (parent_item_id:$parentItemID, item_name:$myItemName, column_values:$columnVals) { id board { id }}}";
              let prodVars = {
                parentItemID: parseInt(id),
                myItemName: prod.name,
                columnVals: JSON.stringify({
                  dup__of_prod_id: parseInt(prod.product_id),
                  quantity3: prod.quantity,
                  dup__of_sku: prod.sku,
                }),
              };
              await sendToMonday(prodQuery, prodVars);
            })
          );

          message = `Order ${orderId} has been updated!`;
          console.log(message);
          return { statusCode: 200, body: message };
        }
      )
      .catch((err) => {
        throw new Error(err.message);
      });
  } else {
    console.log(orderId + " exists");
    let mergedVars = compareAndMerge(
      vars,
      mergedProducts,
      doesItExist.data.items_by_column_values[0]
    );

    let query =
      "mutation ($boardId: Int!, $itemId: Int!, $columnVals: JSON!) { change_multiple_column_values (board_id: $boardId, item_id: $itemId, column_values: $columnVals) { id } }";
    return sendToMonday(query, {
      boardId: mergedVars.boardId,
      itemId: mergedVars.itemId,
      columnVals: mergedVars.columnVals,
    })
      .then(
        async ({
          data: {
            change_multiple_column_values: { id },
          },
        }) => {
          await Promise.all(
            mergedVars.subitems.map(async (prod) => {
              console.log(
                "🚀 ~ file: mondayFuncs.mjs:121 ~ mergedProducts.map ~ prod:",
                prod
              );
              let prodQuery;
              let prodVars;
              if (prod.parent_item_id) {
                prodQuery =
                  "mutation ($boardId: Int!, $itemId: Int!, $columnVals: JSON!) { change_multiple_column_values (board_id: $boardId, item_id: $itemId, column_values: $columnVals) { id } }";
                prodVars = {
                  boardId: Number(prod.parent_item_id),
                  itemId: Number(prod.subitem_id),
                  columnVals: JSON.stringify({
                    name: prod.name,
                    dup__of_prod_id: prod.product_id,
                    quantity3: prod.quantity,
                    dup__of_sku: prod.sku,
                    status: prod.status,
                  }),
                };
              } else {
                prodQuery =
                  "mutation ($parentItemID: Int!, $myItemName: String!, $columnVals: JSON!){ create_subitem (parent_item_id:$parentItemID, item_name:$myItemName, column_values:$columnVals) { id board { id }}}";
                prodVars = {
                  parentItemID: parseInt(id),
                  myItemName: prod.name,
                  columnVals: JSON.stringify({
                    dup__of_prod_id: parseInt(prod.product_id),
                    quantity3: prod.quantity,
                    dup__of_sku: prod.sku,
                  }),
                };
              }
              await sendToMonday(prodQuery, prodVars);
            })
          );

          message = `Order ${orderId} has been updated!`;
          console.log(message);
          return { statusCode: 200, body: message };
        }
      )
      .catch((err) => {
        throw new Error(err.message);
      });
  }
}
