export function toCamel(key: string) {
  return key.replace(/([-_][a-z])/gi, ($1) =>
    $1.toUpperCase().replace("-", "").replace("_", "")
  );
}

export function transformAPIKeyToCamel(input: object): any {
  if (
    typeof input === "string" ||
    typeof input === "number" ||
    typeof input === "boolean" ||
    input === null
  ) {
    return input;
  }
  if (Array.isArray(input)) {
    return input.map(transformAPIKeyToCamel);
  }
  return Object.entries(input).reduce((accumulator, currentValue) => {
    const [key, value] = currentValue;
    const camelKey = toCamel(key);
    // eslint-disable-next-line operator-linebreak

    let camelValue: any = value;
    if (Array.isArray(value)) camelValue = value.map(transformAPIKeyToCamel);
    else if (typeof value === "object" && value !== null) {
      camelValue = transformAPIKeyToCamel(value);
    }

    return {
      ...accumulator,
      [camelKey]: camelValue,
    };
  }, {});
}
