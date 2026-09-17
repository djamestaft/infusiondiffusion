/** Display-only contract; never includes provider identifiers or tokens. */
export type CustomerProfile = {
  name: string | null;
  email: string | null;
  initials: string | null;
};
export type CustomerState =
  | { status: "signed-out" | "expired" | "error" | "loading" }
  | { status: "signed-in"; profile: CustomerProfile };
