import _ from "lodash";

export default function (BCvars, BCProducts, oldOrder) {
  let oldProds = oldOrder.subitems
    ? oldOrder.subitems.reduce((acc, prod) => {
        let reduced = prod.column_values.reduce((acc2, val) => {
          return {
            ...acc2,
            [val.id]:
              !isNaN(val.text) && !isNaN(_.toNumber(val.text))
                ? _.toNumber(val.text)
                : val.text,
          };
        }, []);

        return [
          ...acc,
          {
            subitem_id: prod.id,
            parent_item_id: prod.board.id,

            name: prod.name,
            product_id: reduced.dup__of_prod_id,
            quantity: reduced.quantity3,
            sku: reduced.dup__of_sku,
            status: reduced.status,
          },
        ];
      }, [])
    : [];
  console.log("🚀 ~ file: compareAndMerge.mjs:5 ~ oldProds:", oldProds);
  let oldColVals = oldOrder.column_values.reduce((acc, prod, i) => {
    if (prod.id === "subitems" || prod.id === "subitems_status") return acc;
    acc[prod.id] = JSON.parse(prod.value);
    return acc;
  });
  console.log(
    "🚀 ~ file: compareAndMerge.mjs:37 ~ oldColVals ~ oldColVals:",
    oldColVals
  );
  delete oldColVals.id;
  delete oldColVals.text;
  delete oldColVals.value;

  let newColVals = _.merge(oldColVals, JSON.parse(BCvars.columnVals));
  console.log("🚀 ~ file: compareAndMerge.mjs:46 ~ newColVals:", newColVals);
  let newProdVals = _.merge(oldProds, BCProducts);

  console.log("🚀 ~ file: compareAndMerge.mjs:48 ~ newProdVals:", newProdVals);
  delete newColVals.date0.changed_at;
  return {
    boardId: BCvars.boardId,
    itemId: _.toNumber(oldOrder.id),
    columnVals: JSON.stringify({
      name: BCvars.myItemName,
      ...newColVals,
    }),
    subitems: newProdVals.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) => t.product_id === value.product_id && t.name === value.name
        )
    ),
  };
}
