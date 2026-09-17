# INF-44: policies and customer privacy

## Outcome and ownership

Customers can read terms, shipping, returns and privacy information from every storefront page and before checkout. Shopify owns the published HTML used by both checkout and the Next.js reader. Sanity remains editorial only. Devon owns delivery; Dione Smith is the merchant privacy contact.

The merchant confirmed INFUSION DIFFUSION, 3 Brommaert Place, Constantia, South Africa; not VAT registered; free delivery at R1,000 inclusive. PayFast remains in Test mode. No new analytics are introduced.

## Acceptance criteria

- Four named policy routes and a Policies footer navigation are readable at 320, 390, 768 and 1440px without horizontal overflow.
- Product and cart link to shipping and returns; cart states the inclusive free-delivery threshold.
- Published policy HTML is fetched server-side from Shopify, sanitized, and rendered with a single page H1 and semantic sections. No Admin credentials reach the browser.
- Unknown routes return 404; missing policy/API failures show retry and contact actions, never a blank successful document.
- Terms state non-VAT status, ZAR, supplied business/contact details and the actual checkout payment choices. Returns preserve statutory cooling-off and defective-goods rights; the 24-hour damage request is not a forfeiture deadline.
- Privacy identifies actual processors, cross-border processing, necessary and optional cookies, lawful purposes, retention criteria and POPIA rights. It does not claim unverified consent behavior.
- Shopify South Africa consent is required; native checkout banner must be enabled and tested before claiming the consent defect fixed. Cross-domain consent is not assumed.
- Tests cover unsafe HTML, absent policies, navigation and reading states; visual screenshots, keyboard and axe checks accompany build/unit/Storybook gates.

## Design decision

Product designer reviewed approved Figma footer 2730:45, component 2733:61 and responsive 2730:75/106/139. Add a quiet, naturally wrapping Policies navigation after the existing divider, before copyright. Each standalone link has a 44px minimum target. Existing Explore/Contact hierarchy remains.

The policy reader uses the existing midnight navigation, base surface, headline/title typography, a left-aligned 70ch reading column and responsive gutters. This footer addition and reader are user-requested extensions beyond the approved frames; Figma synchronization and human visual sign-off remain pending. No raw colour or typography tokens are introduced.

## Publication and rollback

`content/policies` contains reviewed publication payloads, not a second runtime content source. Snapshot current Shopify policies/settings before mutation, inspect mutation errors and re-read each change. Restore the snapshot to roll back external content; revert the delivery commit for UI. Existing stronger consent settings must be preserved. Human merge is required before production code release.

## Remaining operational facts

Verify dispatch/delivery estimates, legal entity status, return-handling address, Network Intelligence settings and information-officer registration. Do not invent these. INF-28/31 retain their broader approval gates; INF-44 stays in progress until evidence and external controls are complete.

## Legal sources

Drafting references: [ECTA sections 42–44 and 48](https://www.gov.za/sites/default/files/gcis_document/201409/a25-02.pdf), [CPA sections 51, 55–56 and 61](https://www.gov.za/sites/default/files/32186_467.pdf), and [POPIA](https://www.gov.za/sites/default/files/gcis_document/201409/3706726-11act4of2013protectionofpersonalinforcorrect.pdf). These support the draft; operational and legal review remain separate from software verification.

## Applied Shopify changes — 17 September 2026

Authenticated Admin against permanent domain `serxng-h1.myshopify.com`, verified shop ID `99237232926` and InfusionDiffusion identity. Published TERMS_OF_SERVICE, SHIPPING_POLICY, REFUND_POLICY, PRIVACY_POLICY and CONTACT_INFORMATION. Disabled privacy-policy automatic management through `privacyFeaturesDisable(PRIVACY_POLICY)` to permit the custom POPIA statement. No banner or Network Intelligence feature was disabled.

Set ZA `consentRequired:true`, preserving `dataSaleOptOutRequired:false`. Cookie banner is still disabled; native Admin enablement is outstanding.

Using Shopify's documented new shipping interface (unstable API), updated only Standard's free condition from R770 to R1,000 inclusive, and set the international delivery method inactive. Readback verified Standard R100, Express R150 and international method inactive. Six live product variants all have taxable:false. PayFast remains in Test mode; no payment was submitted.

Published cross-links use Shopify's policy URLs so they work before this frontend branch is merged. The storefront displays the same Shopify content through its own reader. Local payloads are publication records only.

## Verification evidence

- Lint, typecheck and full formatting check passed.
- Vitest: 58 files / 394 tests passed; targeted policy security/contract rerun: 9 passed.
- Storybook: 31 files / 360 tests passed; production Storybook build passed.
- Next production build passed. Policy Playwright suite: 12/12 passed on desktop and mobile, including axe and keyboard navigation, against the production server.
- Product designer reviewed 320/390/768/1440 reader/footer captures: no visual blockers or token drift. Final production captures replace development captures to omit the dev indicator.
- Impeccable detector: no findings on the changed reader, policy links or footer. Audit: readable measure, semantic hierarchy, zero automated axe violations, responsive wrapping, 44px standalone links, no new tracking or browser dependency for policy HTML sanitization.
- A redundant route loading boundary reproduced React/Next PPR segment collisions in production. Keeping the page's single Suspense boundary resolved all new policy journey failures. Similar behavior was observed on the existing Contact route; a broader runtime investigation is outside this policy change.
- Independent public Shopify readback: all five policy URLs returned 200, correct merchant contact/address, no placeholders. Fresh checkout showed all five links and Payfast; only infusion_cart and _shopify_essential cookies were observed before input. No order or payment was submitted.
- Banner is still disabled. Accept/reject/change-preference behavior is unverified until native Admin controls are enabled. Network Intelligence setting confirmation remains pending; conditional disclosures are retained.

Raw snapshots and browser artifacts are in the primary checkout's local `output/privacy-audit-2026-09-17` directory; no cookie values, account tokens or customer data are included in the evidence.
