export default function objectToQueryString(object: Object) {
  let str = "";
  for (const [key, value] of Object.entries(object)) {
    str += `${key}=${value}&`;
  }
  return str.substring(0, str.length - 1);
}
