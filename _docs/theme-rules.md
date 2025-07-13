# Theme Rules: Minimalist Neutral Palette

## Overview
This theme adopts a clean, minimalist design with neutral tones, ample whitespace, and subtle accents to create a focused, non-distracting interface for the TodoList app. Inspired by user preferences and aligned with @project-overview.md, @user-flow.md, and @tech-stack.md, it emphasizes mobile-first layouts, responsive scaling, and gentle animations (e.g., fades). The palette supports light/dark modes for accessibility and comfort, meeting WCAG 2.2 standards (e.g., 4.5:1 contrast). Integrated with Tailwind CSS for utility classes and CSS vars for flexibility.

Key: Simplicity—avoid clutter; Use neutrals for calm; Accents for actions like task completion.

## Color Palette
Neutral-based with soft accents. All meet AA contrast; Dark mode inverts for readability.

| Color Name | Light Mode (Hex) | Dark Mode (Hex) | Usage |
|------------|------------------|-----------------|-------|
| Background Primary | #F9FAFB | #1F2937 | Main backgrounds, app shell |
| Surface | #FFFFFF | #374151 | Cards, modals, task items |
| Text Primary | #111827 | #F9FAFB | Headings, body text |
| Text Secondary | #6B7280 | #9CA3AF | Metadata, subtitles |
| Accent Primary | #3B82F6 | #60A5FA | Buttons, focus highlights |
| Success | #22C55E | #4ADE80 | Completions, checkmarks |
| Warning | #EAB308 | #FBBF24 | Due dates, priorities |
| Error | #EF4444 | #F87171 | Alerts, validation |
| Neutral | #E5E7EB | #4B5563 | Borders, dividers |

Tailwind Config Example:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary': { light: '#F9FAFB', dark: '#1F2937' },
        surface: { light: '#FFFFFF', dark: '#374151' },
        // ... add others
      },
    },
  },
};
```

CSS Vars Example:
```css
:root {
  --bg-primary: #F9FAFB;
  --surface: #FFFFFF;
  // ...
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1F2937;
    --surface: #374151;
    // ...
  }
}
```

## Typography
Clean sans-serif for readability. Modular scale with fluid sizing (clamp) for responsiveness.

- Font Family: 'Inter', system-ui, sans-serif (web-safe, lightweight).
- Sizes: Base 16px; H1: clamp(1.5rem, 5vw, 2rem); Body: 1rem; Small: 0.875rem.
- Weights: 400 (regular), 600 (bold).
- Line Height: 1.5 for body; 1.2 for headings.

CSS Example:
```css
body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
}
h1 {
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 600;
}
```

## Spacing and Layout
4px base unit for consistency; Responsive grids/flex for mobile-first.

- Scale: xs: 0.25rem, sm: 0.5rem, md: 1rem, lg: 1.5rem, xl: 2rem.
- Layout: Flex-col on mobile, grid on desktop (e.g., grid-cols-1 md:grid-cols-2 for tasks).
- Breakpoints: sm (640px), md (768px), lg (1024px).

Tailwind Example: space-y-4 for stacks; gap-4 for grids.

## Shadows, Borders, and Effects
Subtle for depth without clutter.

- Shadows: sm: 0 1px 2px rgba(0,0,0,0.05); md: 0 4px 6px rgba(0,0,0,0.1).
- Borders: Radius: md (0.375rem); Width: 1px solid var(--neutral).
- Effects: Transitions: 200ms ease; Animations: subtle fade (opacity 0 to 1).

CSS Animation Example:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animated { animation: fadeIn 300ms ease-in; }
@media (prefers-reduced-motion) { .animated { animation: none; } }
```

## Accessibility and Variations
- Contrast: All text ≥4.5:1 (tested with WebAIM).
- Modes: Dark via media query; Reduced motion support.
- Touch: Min 44px targets.

## Implementation Guidelines
- Apply via Tailwind (e.g., bg-surface text-text-primary).
- Tools: Storybook for testing; Ensure WCAG with axe-core.
- Maintenance: Update config for new colors; Audit responsiveness. 