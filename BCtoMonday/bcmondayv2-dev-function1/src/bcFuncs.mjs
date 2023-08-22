import { BCACCESSTOKEN, BCSTOREHASH } from "../config.mjs";

import fetchJson from "../utils/fetchJson.mjs";
const headers = {
  "Content-Type": "application/json",
  "X-Auth-Token": BCACCESSTOKEN,
  Accept: "application/json",
};

export async function getOrderInfo(orderId) {
  const orderUrl = new URL(
      `https://api.bigcommerce.com/stores/${BCSTOREHASH}/v2/orders/${orderId}`
    ),
    shippingUrl = new URL(
      `https://api.bigcommerce.com/stores/${BCSTOREHASH}/v2/orders/${orderId}/shipping_addresses`
    ),
    productsUrl = new URL(
      `https://api.bigcommerce.com/stores/${BCSTOREHASH}/v2/orders/${orderId}/products`
    );

  return await Promise.all([
    await fetchJson(orderUrl, { headers }, {}),
    await fetchJson(shippingUrl, { headers }, {}),
    await fetchJson(productsUrl, { headers }, {}),
  ])
    .then((result) => {
      result.forEach((r) => {
        if (r.status && r.status === 404)
          throw new Error("Order not found in BC!!");
        if (r === "missing info") throw r;
      });

      let main = result.find((x) => !Array.isArray(x)),
        shipping_addresses = result.find(
          (x) => Array.isArray(x) && x[0].street_1
        ),
        products = result.find((x) => Array.isArray(x) && x[0].product_id);
      return {
        ...main,
        shipping_addresses: shipping_addresses,
        products: products,
      };
    })
    .catch((err) => {
      console.error("error getting full order info", err);
      if (err === "missing info") return err;
      throw err;
    });
}
