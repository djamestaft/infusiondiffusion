import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ServicePolicyLinks } from "./service-policy-links";
const meta = {
  title: "Components/Service policy links",
  component: ServicePolicyLinks,
} satisfies Meta<typeof ServicePolicyLinks>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
