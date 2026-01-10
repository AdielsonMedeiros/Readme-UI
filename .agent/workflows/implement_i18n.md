---
description: Implement Internationalization (i18n) for English and Portuguese support
---

# Implementation Plan: Internationalization (i18n)

This workflow outlines the steps to add bilingual support (EN/PT) to the application using React Context and a custom translation hook.

## 1. Create Locale Dictionaries
Create a directory `lib/locales` or just `locales` at the root/src.
Define two files: `en.ts` and `pt.ts`.

Structure example:
```typescript
// locales/en.ts
export const en = {
  common: {
    loading: "Loading...",
    generate: "Generate Widgets",
  },
  sidebar: {
    title: "Configuration",
    template: "Choose Template",
    theme: "Theme",
  },
  // ... other sections
}
```

## 2. Create Language Context
Create `contexts/LanguageContext.tsx`.
- State: `language` ('en' | 'pt')
- Effect: Load preference from `localStorage` on mount.
- Provider: Wraps the application.
- Helper Function: `t(path: string)` that traverses the dictionary based on current language.

## 3. Create Custom Hook
Create `hooks/useLanguage.ts` to easily consume the context in components.
Returns: `{ language, setLanguage, t }`

## 4. Refactor `app/page.tsx`
- Wrap the main content (or the Layout) with `LanguageProvider`.
- Replace all hardcoded strings with `t('key')`.
  - Example: `<h1>Configuration</h1>` -> `<h1>{t('sidebar.title')}</h1>`

## 5. Add Language Switcher UI
- Create a `LanguageToggle` component or add directly to the Sidebar header.
- Use `setLanguage` to toggle between 'en' and 'pt'.

## 6. Update Templates (Optional but recommended)
- Pass text props to templates if they need localization (though usually template content is user-defined).
- Ensure static labels in templates (like "Progress") can be overridden or localized if necessary.
