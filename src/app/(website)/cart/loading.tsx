import { StorefrontLoadingTemplate } from "@/components/templates/storefront-templates";

export default function CartLoading() {
  return <StorefrontLoadingTemplate kind="cart" currentHref="/cart" />;
}
