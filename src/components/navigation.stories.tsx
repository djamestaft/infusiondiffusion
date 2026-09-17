import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Navigation } from "@/components/navigation";

const meta = {
  title: "Components/Navigation",
  component: Navigation,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Navigation uses source-label casing, normal letter spacing and the footer links' navigation-muted color, semibold (600) weight and antialiased font smoothing. Manrope, the gold active underline, an 86px desktop and 78px mobile/tablet header, existing logo sizes and 44px controls are retained. The solid border stays inside that height.",
      },
    },
  },
  args: { currentHref: "/shop" },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ivory: Story = {};

export const CurrentAbout: Story = {
  args: { currentHref: "/about" },
};

export const CurrentContact: Story = {
  args: { currentHref: "/contact" },
};

export const CurrentContactMobileOpen: Story = {
  args: { currentHref: "/contact" },
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open menu" }),
    );
  },
};

export const CurrentAboutMobileOpen: Story = {
  args: { currentHref: "/about" },
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open menu" }),
    );
  },
};

export const Midnight: Story = {
  args: { theme: "midnight" },
};

export const ProvisionedAccount: Story = {
  args: { accountHref: "/account" },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Account" });
    await expect(link).toHaveAttribute("href", "/account");
    link.focus();
    await expect(link).toHaveFocus();
  },
};

export const AccountTablet: Story = {
  ...ProvisionedAccount,
  globals: { viewport: { value: "homepageTablet", isRotated: false } },
};

export const AccountMobile: Story = {
  ...ProvisionedAccount,
  globals: { viewport: { value: "contact390", isRotated: false } },
};

export const AccountNarrowMenu: Story = {
  args: { accountHref: "/account" },
  globals: { viewport: { value: "contact320", isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Open menu" });
    await userEvent.click(opener);
    const menu = within(canvas.getByRole("dialog"));
    await expect(menu.getByRole("link", { name: "Account" })).toHaveAttribute(
      "href",
      "/account",
    );
    await userEvent.keyboard("{Escape}");
    await expect(opener).toHaveFocus();
  },
};

export const MobileClosed: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
};

export const MobileOpen: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open menu" }),
    );
    await expect(
      within(within(canvasElement).getByRole("dialog")).getByRole("link", {
        name: "Infusion Diffusion home",
      }),
    ).toHaveFocus();
  },
};

export const MobileOpen320: Story = {
  globals: { viewport: { value: "contact320", isRotated: false } },
  play: MobileOpen.play,
};

export const MidnightMobileOpen: Story = {
  args: { theme: "midnight" },
  globals: MobileOpen.globals,
  play: MobileOpen.play,
};

export const LongLabels: Story = {
  args: {
    destinations: [
      { label: "Shop the complete collection", href: "/shop" },
      { label: "A considered guide to fragrance", href: "/fragrance-guide" },
      { label: "About Infusion Diffusion", href: "/about" },
      { label: "Contact our fragrance studio", href: "/contact" },
    ],
  },
};

export const EmptyDestinations: Story = {
  args: { destinations: [] },
};

export const CartUnavailable: Story = {
  args: { cartCount: null, theme: "midnight" },
};

export const CartUnavailableMobile: Story = {
  ...CartUnavailable,
  globals: MobileClosed.globals,
};

export const CartUnavailableMobileOpen: Story = {
  ...CartUnavailableMobile,
  play: async (context) => {
    await MobileOpen.play?.(context);
    await expect(
      within(within(context.canvasElement).getByRole("dialog")).getByRole(
        "link",
        { name: "Cart, item count unavailable" },
      ),
    ).toHaveAttribute("href", "/cart");
  },
};

const signedInProfile = {
  name: "Amara Jacobs",
  email: "amara@example.test",
  initials: "AJ",
};
export const AvatarDefault: Story = {
  args: {
    theme: "midnight",
    accountHref: "/account",
    accountProfile: signedInProfile,
  },
};
export const AvatarCurrent: Story = {
  ...AvatarDefault,
  args: { ...AvatarDefault.args, currentHref: "/account" },
};
export const AvatarHover: Story = {
  ...AvatarDefault,
  play: async ({ canvasElement }) => {
    await userEvent.hover(
      within(canvasElement).getByRole("link", {
        name: "Account, signed in as Amara Jacobs",
      }),
    );
  },
};
export const AvatarFocus: Story = {
  ...AvatarDefault,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: "Account, signed in as Amara Jacobs",
    });
    link.focus();
    await expect(link).toHaveFocus();
  },
};
export const AvatarNoInitials: Story = {
  ...AvatarDefault,
  args: {
    ...AvatarDefault.args,
    accountProfile: { name: null, email: null, initials: null },
  },
};
export const AvatarSingleInitial: Story = {
  ...AvatarDefault,
  args: {
    ...AvatarDefault.args,
    accountProfile: { name: "Élodie", email: null, initials: "É" },
  },
};
export const AvatarSignedOut: Story = {
  ...AvatarDefault,
  args: { ...AvatarDefault.args, accountProfile: null },
};
export const AvatarIvory: Story = {
  ...AvatarDefault,
  args: { ...AvatarDefault.args, theme: "ivory" },
};
export const AvatarMobile320: Story = {
  ...AvatarDefault,
  globals: { viewport: { value: "contact320", isRotated: false } },
};
export const AvatarMobileOpen: Story = {
  ...AvatarMobile320,
  play: MobileOpen.play,
};
export const AvatarFloating: Story = {
  ...AvatarDefault,
  args: { ...AvatarDefault.args, floating: true },
  decorators: [
    (Story) => (
      <div className="bg-navigation-surface dark min-h-[120vh]">
        <Story />
      </div>
    ),
  ],
};

export const AvatarLoading: Story = {
  args: { theme: "midnight", accountHref: "/account", accountLoading: true },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: "Account, checking sign-in status",
    });
    await expect(link).toHaveAttribute("aria-busy", "true");
    await expect(link).toHaveAttribute("href", "/account");
    link.focus();
    await expect(link).toHaveFocus();
  },
};
export const AvatarLoadingIvory: Story = {
  ...AvatarLoading,
  args: { ...AvatarLoading.args, theme: "ivory" },
};
export const AvatarLoadingMobile: Story = {
  ...AvatarLoading,
  globals: AvatarMobile320.globals,
};
export const AvatarLoadingMobileOpen: Story = {
  ...AvatarLoadingMobile,
  play: MobileOpen.play,
};

export const TouchThenKeyboard: Story = {
  args: { theme: "midnight" },
  globals: MobileOpen.globals,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Open menu" });
    await userEvent.click(opener);
    const logo = within(canvas.getByRole("dialog")).getByRole("link", {
      name: "Infusion Diffusion home",
    });
    await expect(logo).toHaveFocus();
    await expect(getComputedStyle(logo).outlineStyle).toBe("none");
    await userEvent.click(canvas.getByRole("button", { name: "Close menu" }));
    await expect(opener).toHaveFocus();
    await expect(getComputedStyle(opener).outlineStyle).toBe("none");
    await userEvent.keyboard("{Enter}");
    const keyboardLogo = within(canvas.getByRole("dialog")).getByRole("link", {
      name: "Infusion Diffusion home",
    });
    await expect(keyboardLogo).toHaveFocus();
    await expect(getComputedStyle(keyboardLogo).outlineStyle).toBe("solid");
    await userEvent.keyboard("{Escape}");
    await expect(opener).toHaveFocus();
  },
};
