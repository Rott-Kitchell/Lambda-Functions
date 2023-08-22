// does the fetching
export default async function fetchJson(url, options, onCancel) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 0));
    let res = await fetch(url, options);
    if (res.status === 204) return "missing info";
    return res.json();
  } catch (err) {
    console.error(err);
  }
}
