"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CustomerState } from "@/lib/shopify/customer-account/contract";

const AccountNavigationContext = createContext<string | null>(null);
const CustomerContext = createContext<{
  state: CustomerState;
  refresh: () => void;
  signOut: () => void;
}>({ state: { status: "signed-out" }, refresh: () => {}, signOut: () => {} });
export function AccountNavigationProvider({
  enabled,
  sessionEnabled = false,
  children,
}: {
  enabled: boolean;
  sessionEnabled?: boolean;
  children: ReactNode;
}) {
  const [state, setState] = useState<CustomerState>({
    status: sessionEnabled ? "loading" : "signed-out",
  });
  const sequence = useRef(0);
  const channel = useRef<BroadcastChannel | null>(null);
  const refresh = useCallback(async () => {
    if (!sessionEnabled) return;
    const current = ++sequence.current;
    try {
      const response = await fetch("/api/account", {
        cache: "no-store",
        credentials: "same-origin",
        signal: AbortSignal.timeout(15000),
      });
      const next: CustomerState = await response.json();
      if (sequence.current === current)
        setState(response.ok ? next : { status: "error" });
    } catch {
      if (sequence.current === current) setState({ status: "error" });
    }
  }, [sessionEnabled]);
  const invalidate = useCallback(() => {
    sequence.current++;
  }, []);
  const clear = useCallback(() => {
    sequence.current++;
    setState({ status: "loading" });
  }, []);
  const revalidate = useCallback(() => {
    clear();
    void refresh();
  }, [clear, refresh]);
  const signOut = useCallback(() => {
    invalidate();
    channel.current?.postMessage("signed-out");
  }, [invalidate]);
  useEffect(() => {
    if (!sessionEnabled) return;
    if ("BroadcastChannel" in window) {
      channel.current = new BroadcastChannel("infusion-account");
      channel.current.onmessage = () => clear();
    }
    const visible = () => {
      if (document.visibilityState === "visible") revalidate();
      else clear();
    };
    const initialRefresh = window.setTimeout(refresh, 0);
    window.addEventListener("focus", revalidate);
    window.addEventListener("pageshow", revalidate);
    window.addEventListener("pagehide", clear);
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.clearTimeout(initialRefresh);
      invalidate();
      channel.current?.close();
      channel.current = null;
      window.removeEventListener("focus", revalidate);
      window.removeEventListener("pageshow", revalidate);
      window.removeEventListener("pagehide", clear);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [sessionEnabled, refresh, clear, revalidate, invalidate]);
  return (
    <AccountNavigationContext.Provider value={enabled ? "/account" : null}>
      <CustomerContext.Provider value={{ state, refresh: revalidate, signOut }}>
        {children}
      </CustomerContext.Provider>
    </AccountNavigationContext.Provider>
  );
}
export const useAccountNavigationHref = () =>
  useContext(AccountNavigationContext);
export const useCustomerAccount = () => useContext(CustomerContext);
