# Theme Rules: Tan Earthy Minimalist

## Overview
This theme adopts a clean, minimalist design with neutral tones, ample whitespace, and subtle accents to create a focused, non-distracting interface for the TodoList app. Inspired by user preferences and aligned with @project-overview.md, @user-flow.md, and @tech-stack.md, it emphasizes mobile-first layouts, responsive scaling, and gentle animations (e.g., fades). The palette supports light/dark modes for accessibility and comfort, meeting WCAG 2.2 standards (e.g., 4.5:1 contrast). Integrated with Tailwind CSS for utility classes and CSS vars for flexibility.

Key: Simplicity—avoid clutter; Use neutrals for calm; Accents for actions like task completion.

## Color Palette
The palette draws from natural elements: warm neutrals for backgrounds, dark grays for text, and subtle accents in muted greens and oranges.

- Modes: Light mode primary; extendable to dark with inverted values.

| Color Name | Light Mode (Hex) | Dark Mode (Hex) | Usage |
|------------|------------------|-----------------|-------|
| Background Primary | #f4f0e6 | #1a1917 | Main app background, subtle gradients |
| Surface | #fef9ef | #2c2b29 | Cards, modals, elevated elements |
| Text Primary | #2C2C2C | #e5e5e5 | Headings, body text |
| Text Secondary | #6B6B6B | #a3a3a3 | Subtitles, metadata, disabled states |
| Accent Primary | #C17A56 | #d99b7a | Buttons, icons, highlights (e.g., priorities) |
| Success | #7BB27A | #9fd99e | Positive feedback, completions |
| Warning | #FF6B35 | #ff8c5e | Alerts, due dates |
| Info | #4F46E5 | #7f75ff | Insights, secondary actions |
| Neutral | #e5e7eb | #4b4b4b | Borders, dividers |
| Error | #DC3545 | #ff6666 | Errors, critical alerts |

Code Example (Tailwind config.js):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary': '#f4f0e6',
        surface: '#fef9ef',
        // ... other colors
      },
    },
  },
};
```

Code Example (CSS Variables):
```css
:root {
  --bg-primary: #f4f0e6;
  --surface: #fef9ef;
  // ...
}
```

## Typography
Use a clean, sans-serif font stack for readability. Sizes follow a modular scale (base 16px) with responsive adjustments (e.g., clamp for fluid typography). Weights: 400 (regular), 500 (medium), 700 (bold). Line height: 1.6 for body text.

- Font Family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; Fallback: sans-serif.
- Sizes:
  - Base: 16px (1rem)
  - H1: 2.25rem (36px)
  - H2: 1.5rem (24px)
  - Body: 1rem (16px)
- Effects: Subtle text shadows for depth on headings (e.g., 0 2px 4px rgba(0,0,0,0.1)).

Code Example (CSS):
```css
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
}
```

## Spacing and Layout
Use a 4px base unit for consistency (rem-based for accessibility). Grid and flex for layouts. Breakpoints: Mobile (0-639px), Tablet (640-1023px), Desktop (1024px+).

- Spacing Scale: xs: 0.25rem (4px), sm: 0.5rem (8px), md: 1rem (16px), lg: 1.5rem (24px), xl: 2rem (32px), 2xl: 3rem (48px).
- Padding/Margins: Consistent p-4 for cards, space-y-4 for vertical stacks.
- Layout: Flex-col for vertical mobile flows; grid for stats (e.g., grid-cols-2).

Code Example (Tailwind Classes):
- Padding: p-4, px-4 py-2
- Spacing: space-y-6, gap-3

## Icons and Imagery
- Icon Set: Lucide-react (or similar line icons) for consistency.
- Sizes: Small: 20x20px (w-5 h-5), Medium: 24x24px (w-6 h-6), Large: 32x32px (w-8 h-8).
- Styles: Stroke width 1.5-2, colored via accents (e.g., success for checkmarks).
- Imagery: SVGs preferred; lazy-load images with alt text. Aspect ratios: Square for icons, 16:9 for banners.

Code Example:
```jsx
<Icon className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
```

## Shadows, Borders, and Effects
- Shadows: Soft elevations for depth—sm: 0px 2px 8px rgba(0,0,0,0.06); md: 0px 4px 15px rgba(0,0,0,0.08).
- Borders: Radius: xl (rounded-xl: 0.75rem/12px), 2xl (rounded-2xl: 1rem/16px); Width: 1-2px; Styles: solid/dashed for priorities.
- Effects: Transitions: all 300ms ease; Hovers: -translate-y-1, shadow-lg; Animations: pulse (scale/opacity).

Code Example (CSS Animations):
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}
```

## Accessibility and Variations
- Contrast: All text ≥4.5:1 (tested with WebAIM).
- Modes: Dark via media query; Reduced motion support.
- Touch: Min 44px targets.

## Implementation Guidelines
- Apply via Tailwind (e.g., bg-surface text-text-primary).
- Tools: Storybook for testing; Ensure WCAG with axe-core.
- Maintenance: Update config for new colors; Audit responsiveness. 