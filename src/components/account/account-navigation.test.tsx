import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  AccountNavigationProvider,
  useCustomerAccount,
} from "./account-navigation";
import type { CustomerState } from "@/lib/shopify/customer-account/contract";
import { Navigation } from "../navigation";

const signedIn = {
  status: "signed-in",
  profile: {
    name: "Amara Jacobs",
    email: "amara@example.test",
    initials: "AJ",
  },
};
const fetchMock = vi.fn();
let resolveRequest: (response: Response) => void;
function pending() {
  return new Promise<Response>((resolve) => {
    resolveRequest = resolve;
  });
}
async function respond(
  body: CustomerState = signedIn as CustomerState,
  status = 200,
) {
  await act(async () => {
    resolveRequest(Response.json(body, { status }));
  });
}
function Controls() {
  const { state, refresh, signOut } = useCustomerAccount();
  return (
    <>
      <output>{state.status}</output>
      <button onClick={refresh}>Retry</button>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}
async function mount() {
  render(
    <AccountNavigationProvider enabled sessionEnabled>
      <Navigation />
      <Controls />
    </AccountNavigationProvider>,
  );
  await act(async () => {
    vi.advanceTimersByTime(0);
  });
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", fetchMock.mockReset().mockImplementation(pending));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it("renders a loading account instead of a signed-out icon while checking the session", async () => {
  await mount();
  expect(
    screen.getAllByRole("link", {
      name: "Account, checking sign-in status",
    })[0],
  ).toHaveAttribute("aria-busy", "true");
  expect(screen.queryByRole("link", { name: "Account" })).toBeNull();
  await respond();
  expect(
    screen.getAllByRole("link", {
      name: "Account, signed in as Amara Jacobs",
    })[0],
  ).not.toHaveAttribute("aria-busy");
});
it("keeps verified initials visible during a focus check and deduplicates simultaneous events", async () => {
  await mount();
  await respond();
  fireEvent.focus(window);
  expect(screen.getByRole("status")).toHaveTextContent("signed-in");
  fireEvent(window, new Event("pageshow"));
  fireEvent.focus(window);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  await respond();
});
it("shares the first in-flight request with pageshow and focus", async () => {
  await mount();
  fireEvent(window, new Event("pageshow"));
  fireEvent.focus(window);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  await respond();
});
it("invalidates an older response while the native logout form navigates", async () => {
  await mount();
  await respond();
  fireEvent.focus(window);
  fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
  await respond({ status: "expired" });
  expect(screen.getByRole("status")).toHaveTextContent("signed-in");
});
it("clears identity for pagehide and rejects a stale response after returning", async () => {
  await mount();
  await respond();
  fireEvent.focus(window);
  const stale = resolveRequest;
  fireEvent(window, new Event("pagehide"));
  expect(screen.queryByText("AJ")).toBeNull();
  fireEvent(window, new Event("pageshow"));
  await respond({ status: "signed-out" });
  await act(async () => {
    stale(Response.json(signedIn));
  });
  expect(screen.getByRole("status")).toHaveTextContent("signed-out");
});
it("clears identity on a failed check and supports explicit retry", async () => {
  await mount();
  await respond();
  fireEvent.focus(window);
  await respond({ status: "error" }, 503);
  expect(screen.queryByText("AJ")).toBeNull();
  expect(screen.getByRole("status")).toHaveTextContent("error");
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(screen.getByRole("status")).toHaveTextContent("loading");
  await respond();
  expect(screen.getByRole("status")).toHaveTextContent("signed-in");
});

it("clears a verified identity when the server confirms expiry", async () => {
  await mount();
  await respond();
  fireEvent.focus(window);
  await respond({ status: "expired" });
  expect(screen.queryByText("AJ")).toBeNull();
  expect(screen.getByRole("status")).toHaveTextContent("expired");
});
