const brandName = "Infusion Diffusion";
const brandSuffix = ` | ${brandName}`;

export function storefrontTitle(value: string) {
  const title = value.trim();
  if (title === brandName) return brandName;

  const pageTitle = title.replace(
    new RegExp(`(?: \\| ${brandName})+$`, "i"),
    "",
  );
  return `${pageTitle}${brandSuffix}`;
}

export function absoluteStorefrontTitle(value: string) {
  return { absolute: storefrontTitle(value) } as const;
}
