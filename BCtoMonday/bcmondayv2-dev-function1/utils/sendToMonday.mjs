import fetchJson from "./fetchJson.mjs";
import { MONDAYTOKEN } from "../config.mjs";

const headers = {
  "Content-Type": "application/json",
  Authorization: MONDAYTOKEN,
  Connection: "Close",
};

export default async function sendToMonday(query, vars) {
  const url = new URL("https://api.monday.com/v2");
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ query: query, variables: vars }),
  };
  let response = await fetchJson(url, options, {});
  console.log(
    "🚀 ~ file: sendToMonday.mjs:19 ~ sendToMonday ~ response:",
    response
  );
  return response;
}
