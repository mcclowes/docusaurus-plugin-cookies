# Docusaurus Cookie Consent Demo

This folder contains a minimal Docusaurus site that showcases how to configure and use `docusaurus-plugin-cookie-consent`.

## Getting started

```bash
npm install
npm start
```

The dev server starts on `http://localhost:3000` with the plugin enabled.

## Highlights

- The plugin is configured in `docusaurus.config.ts` with custom copy, category defaults, and toast mode enabled.
- `CookiePreferenceDemo.tsx` demonstrates how to read and mutate consent state via the `useCookieConsent` hook.
- Documentation pages under `docs/` describe the example setup and provide placeholders you can replace with your real policies.

## What to customize

- Swap the demo policy text in `docs/privacy-policy.md` for production content.
- Adjust the `storageKey` and button labels in the plugin options to match your brand.
- Extend the example components to trigger analytics or marketing scripts when the relevant consent toggles are enabled.
