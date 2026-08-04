const merchandiseId = /^gid:\/\/shopify\/ProductVariant\/[A-Za-z0-9_-]+$/;
const cartLineId =
  /^gid:\/\/shopify\/CartLine\/[A-Za-z0-9_-]+(?:\?[^\s#]{1,256})?$/;

export function isValidMerchandiseId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 256 &&
    merchandiseId.test(value)
  );
}

export function isValidCartLineId(value: unknown): value is string {
  return (
    typeof value === "string" && value.length <= 512 && cartLineId.test(value)
  );
}

export function isValidCartQuantity(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 99
  );
}
