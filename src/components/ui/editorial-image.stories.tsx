import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EditorialImage } from "./editorial-image";
const meta = {
  title: "Components/EditorialImage",
  component: EditorialImage,
  args: {
    image: {
      src: "https://cdn.sanity.io/images/j222nd1i/production/a11a25ccc0c62af062a250f0db789a5d75f964c0-2172x724.png",
      mobileSrc:
        "https://cdn.sanity.io/images/j222nd1i/production/2fa1677a02d5347d597d09aa213089e946d228fa-1254x1254.png",
      alt: "Santuaire Serein diffuser and gift packaging on a travertine console.",
    },
  },
  render: (args) => (
    <div className="relative h-80 w-[700px] max-w-full">
      <EditorialImage {...args} />
    </div>
  ),
} satisfies Meta<typeof EditorialImage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Desktop: Story = {};
export const Phone: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
};
export const NoPhoneArtwork: Story = {
  args: {
    image: {
      src: "https://cdn.sanity.io/images/j222nd1i/production/a11a25ccc0c62af062a250f0db789a5d75f964c0-2172x724.png",
      alt: "Santuaire Serein diffuser and gift packaging on a travertine console.",
    },
  },
};
export const FailedDecorative: Story = {
  args: {
    image: { src: "/missing-editorial-photo.png", alt: "" },
    decorative: true,
  },
};
