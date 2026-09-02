import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-primitives";
import { FeedbackAlert } from "@/components/ui/feedback-alert";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/utils";

export type AccountEntryState =
  | "available"
  | "disabled"
  | "configuration-missing"
  | "not-provisioned"
  | "loading"
  | "error";

export type AccountEntryProps = {
  state: AccountEntryState;
  destination?: string;
  cartCount?: number;
  longContent?: boolean;
  onRetry?: () => void;
};

type AccountMessage = {
  lead?: string;
  action?: string;
  title?: string;
  body?: string;
};

const messages: Record<
  Exclude<AccountEntryState, "loading">,
  AccountMessage
> = {
  available: {
    lead: "Continue securely to Shopify to access your account.",
    action: "Continue to your account",
  },
  disabled: {
    title: "Account access is not currently available",
    body: "You can continue browsing the collection while this service is unavailable.",
  },
  "configuration-missing": {
    title: "Account access is not currently available",
    body: "You can continue browsing the collection while this service is unavailable.",
  },
  "not-provisioned": {
    title: "Account destination is not available",
    body: "We cannot continue to the hosted account service at the moment. You can continue browsing the collection.",
  },
  error: {
    title: "We could not reach account access",
    body: "Nothing was submitted. Please try again or continue browsing the collection.",
  },
};

export function AccountEntry({
  state,
  destination,
  cartCount = 0,
  longContent = false,
  onRetry,
}: AccountEntryProps) {
  const isLoading = state === "loading";
  const content =
    state === "available"
      ? messages.available
      : state === "loading"
        ? undefined
        : messages[state];
  return (
    <div className="bg-content-surface text-content-primary min-h-dvh">
      <Navigation
        cartCount={cartCount}
        accountHref={state === "available" ? "/account" : undefined}
      />
      <main
        aria-busy={isLoading || undefined}
        className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-7xl items-center px-5 py-16 sm:px-8 lg:min-h-[calc(100dvh-6.5rem)] lg:px-12 lg:py-24"
      >
        <section className="w-full max-w-2xl">
          {isLoading ? (
            <AccountLoadingContent />
          ) : (
            <>
              <ContentHeader
                title="Your account"
                headingLevel={1}
                headingTreatment="headline"
                lead={content?.lead}
              />
              {state === "available" && destination ? (
                <Button asChild size="large" className="mt-8">
                  <a href={destination}>{messages.available.action!}</a>
                </Button>
              ) : null}
              {state !== "available" ? (
                <div className="mt-8 space-y-6">
                  <FeedbackAlert
                    tone={state === "error" ? "error" : "info"}
                    announcement={state === "error" ? "alert" : "none"}
                    title={content?.title}
                  >
                    {content?.body}
                  </FeedbackAlert>
                  {state === "error" && onRetry ? (
                    <Button onClick={onRetry}>Try again</Button>
                  ) : null}
                  <TextLink href="/shop" variant="standalone">
                    Shop the collection
                  </TextLink>
                </div>
              ) : null}
              {longContent ? (
                <p className="text-content-secondary mt-8 max-w-[70ch] font-sans leading-7 break-words">
                  This account handoff keeps customer access with Shopify. The
                  destination can contain a deliberately long, unbroken
                  explanatory fixture only to verify that the first-party page
                  retains natural height and wraps safely at constrained widths:
                  accountaccessinformationaccountaccessinformationaccountaccessinformation.
                </p>
              ) : null}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export function AccountLoadingContent() {
  return (
    <div className="w-full max-w-2xl animate-pulse space-y-5 motion-reduce:animate-none">
      <h1 className="sr-only">Your account</h1>
      <p className="bg-content-surface-elevated h-4 w-24" />
      <div className="bg-content-surface-elevated h-14 w-3/4" />
      <div className="bg-content-surface-elevated h-6 w-full max-w-xl" />
      <div className={cn("bg-content-surface-elevated h-12 w-56")} />
    </div>
  );
}
