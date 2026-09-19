# Hero hover continuity correction

Authority: Devon's confirmed reproduction and explicit fix request on PR109.
One existing delivery branch, root implementation writer, independent read-only
reviewer. Preserve the normal-laptop and gallery fixes. No merge/production deploy.

1. Reproduce navigation-boundary clearing and audit continuous hover. Record the
   extra reset caused by transformed root scrollWidth in the shared measurement
   signature. Add failing unit and real-browser regressions before runtime edits.
2. Split HeroAtmosphere pause from reset/teardown. Ordinary leave freezes the pose
   and cancels RAF; re-entry starts a fresh clock from that pose. Focus resets to a
   static centered crop. Hidden/offscreen states suspend work. Teardown restores
   owned inline styles and listeners. Establish eligible overscan in CSS before
   first hover, retaining scale through hover/focus boundaries. Reduced motion,
   explicit pause and ineligible viewports restore the unenhanced crop.
3. Measure untransformed scope/photo dimensions; retain scrollWidth only on the
   collection track where intrinsic overflow determines travel. Test load events
   with changed visual overflow but unchanged layout, plus real geometry changes.
4. Verify first hover, repeated navigation/logo/link crossings, re-entry,
   continuous movement/load events, focus/visibility/offscreen, preferences,
   explicit pause and cleanup. Chromium/WebKit/Firefox at1440x800,1366x768,1280x720.
   Capture frame-level transform traces and video, and inspect actual images.
5. Run source checks, independent review and exact-head CI/PR gate. Push PR109,
   verify health SHA and exact reproduction on protected Vercel preview, attach
   visual/trace evidence, notify Herdr pane2 and report full URL. No claim of
   smoothness based only on CI/console output. Preserve known no-JS/device limits.
