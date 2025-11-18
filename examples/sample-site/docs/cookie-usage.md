---
title: Cookie Usage
---

The demo defines three optional cookie categories—analytics, marketing, and functional—alongside the always-on necessary cookies.

| Category   | Purpose                                                        | Default  |
| ---------- | -------------------------------------------------------------- | -------- |
| Analytics  | Understand aggregate usage trends for documentation pages.     | Enabled  |
| Marketing  | Personalize announcements about new releases or blog articles. | Disabled |
| Functional | Remember UI preferences like dark mode and collapsed sidebars. | Enabled  |

The configuration lives in `docusaurus.config.ts` under the `plugins` array. You can tweak the copy, default states, or add new categories to fit your compliance requirements.

To reset your preferences during local development, use the **Reset consent** button in the demo widget or clear the `localStorage` entry whose key matches the `storageKey` option.
