import type { CustomerState } from "@/lib/shopify/customer-account/contract";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ContentHeader, Heading } from "@/components/ui/content-primitives";
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
  customerState?: CustomerState;
  notice?: string;
  onSignOut?: () => void;
  signingOut?: boolean;
  destination?: string;
  cartCount?: number | null;
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
  customerState,
  notice,
  onSignOut,
  signingOut = false,
}: AccountEntryProps) {
  const isLoading = customerState
    ? customerState.status === "loading"
    : state === "loading";
  const content =
    state === "available"
      ? messages.available
      : state === "loading"
        ? undefined
        : messages[state];
  return (
    <div className="bg-content-surface text-content-primary min-h-dvh">
      <Navigation
        currentHref="/account"
        theme="midnight"
        cartCount={cartCount}
        accountProfile={
          customerState?.status === "signed-in"
            ? customerState.profile
            : undefined
        }
        accountHref={state === "available" ? "/account" : undefined}
      />
      <main
        aria-busy={isLoading || undefined}
        className={cn(
          "mx-auto w-full max-w-7xl px-5 pt-10 pb-14 md:px-12 lg:pt-16 lg:pb-20",
          customerState?.status === "signed-in"
            ? "lg:min-h-[35rem]"
            : "min-h-[38.75rem] lg:min-h-[35rem]",
        )}
      >
        <section className="w-full">
          {isLoading ? (
            <AccountLoadingContent />
          ) : (
            <>
              <ContentHeader
                title="Your account"
                headingLevel={1}
                headingTreatment="headline"
                lead={
                  customerState
                    ? "View your purchases and manage your account."
                    : content?.lead
                }
              />
              {customerState ? (
                <CustomerAccountContent
                  state={customerState}
                  destination={destination}
                  onRetry={onRetry}
                  notice={notice}
                  onSignOut={onSignOut}
                  signingOut={signingOut}
                />
              ) : null}
              {!customerState && state === "available" && destination ? (
                <Button asChild size="large" className="mt-8 text-center">
                  <a href={destination}>{messages.available.action!}</a>
                </Button>
              ) : null}
              {!customerState && state !== "available" ? (
                <div className="mt-8 max-w-2xl space-y-6">
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
      <Footer />
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

function CustomerAccountContent({
  state,
  destination,
  onRetry,
  notice,
  onSignOut,
  signingOut,
}: {
  state: CustomerState;
  destination?: string;
  onRetry?: () => void;
  notice?: string;
  onSignOut?: () => void;
  signingOut: boolean;
}) {
  if (state.status === "signed-in")
    return (
      <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-2 md:gap-16">
        <section
          aria-labelledby="account-details-heading"
          className="border-content-primary/25 min-w-0 space-y-5 border-t pt-6"
        >
          <Heading id="account-details-heading" level={2} treatment="title">
            Your details
          </Heading>
          <dl className="space-y-5 font-sans">
            {[
              ["Name", state.profile.name],
              ["Email", state.profile.email],
            ].map(([label, value]) => (
              <div key={label} className="space-y-1">
                <dt className="text-content-secondary text-sm">{label}</dt>
                <dd className="text-base leading-7 [overflow-wrap:anywhere]">
                  <bdi>{value || "Not provided"}</bdi>
                </dd>
              </div>
            ))}
          </dl>
          <form method="post" action="/account/logout" onSubmit={onSignOut}>
            <Button
              type="submit"
              variant="ghost"
              className="min-w-36"
              disabled={signingOut}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          </form>
        </section>
        {destination ? (
          <section
            aria-labelledby="account-orders-heading"
            className="border-content-primary/25 min-w-0 space-y-5 border-t pt-6"
          >
            <Heading id="account-orders-heading" level={2} treatment="title">
              Your orders
            </Heading>
            <p className="font-sans text-base leading-[1.625]">
              Revisit your purchases and check their delivery status.
            </p>
            <Button
              asChild
              size="large"
              className="w-full text-center md:w-auto"
            >
              <a href={destination}>View your orders</a>
            </Button>
          </section>
        ) : null}
      </div>
    );
  const failed = state.status === "error" || notice === "error";
  return (
    <div className="mt-8 max-w-2xl space-y-6">
      {failed ? (
        <FeedbackAlert
          tone="error"
          announcement="alert"
          title="We could not reach your account"
        >
          Please try again. Your account details are temporarily unavailable.
        </FeedbackAlert>
      ) : null}
      {state.status === "expired" ? (
        <p className="text-content-secondary font-sans">
          Your session has ended. Sign in again to see your account.
        </p>
      ) : null}
      {notice === "signed-out" ? (
        <p role="status" className="text-content-secondary font-sans">
          You’re signed out.
        </p>
      ) : null}
      {notice === "local-signout" ? (
        <p role="status" className="text-content-secondary font-sans">
          You’re signed out of this site. Shopify’s account session may still be
          active.
        </p>
      ) : null}
      {failed && onRetry ? (
        <Button onClick={onRetry}>Try again</Button>
      ) : (
        <Button asChild size="large">
          <a href="/account/login">Sign in</a>
        </Button>
      )}
      {failed && destination ? (
        <div>
          <TextLink href={destination} variant="standalone">
            Continue to your account
          </TextLink>
        </div>
      ) : null}
    </div>
  );
}
