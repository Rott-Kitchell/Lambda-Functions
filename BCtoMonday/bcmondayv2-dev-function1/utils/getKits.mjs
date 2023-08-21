import fetchJson from "./fetchJson.mjs";
import { KITTOKEN, BCSTOREHASH } from "../config.mjs";
const headers = {
  "Content-Type": "application/json",
  "X-Auth-Token": KITTOKEN,
};

export default async function getKits() {
  const url = new URL(`https://kb-load.anvasoft.ca/api/${BCSTOREHASH}/kits`);
  const options = {
    method: "GET",
    headers,
  };
  let fullKits = await fetchJson(url, options, {});
  return fullKits.reduce((acc, kit) => {
    return [...acc, kit.kit_sku];
  }, []);
}
