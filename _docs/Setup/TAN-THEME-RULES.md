# Theme Rules: Tan Earthy Minimalist

This theme adopts a warm, minimalist design inspired by natural earth tones, creating a calm, approachable, and professional user experience. It emphasizes clean lines, subtle shadows, ample whitespace, and gentle animations to enhance usability without overwhelming the user. The palette uses soft tans, beiges, and accents in muted greens and oranges for a grounded, wellness-oriented feel—ideal for health, productivity, or lifestyle apps. It supports light mode by default (with potential for dark mode extensions) and is optimized for mobile-first development, ensuring responsiveness across devices.

This theme integrates well with Tailwind CSS (via config extensions) or plain CSS variables. Key principles: Accessibility-first (high contrast ratios), performance (minimal effects), and scalability (semantic variables).

## Color Palette
The palette draws from natural elements: warm neutrals for backgrounds, dark grays for text, and subtle accents for interactions. All colors meet WCAG AA contrast (4.5:1 minimum for text).

- Modes: Light mode primary; extendable to dark with inverted values.
- Usage: Neutrals for structure, accents for calls-to-action/feedback.

| Color Name | Light Mode (Hex) | Dark Mode (Hex) | Usage |
|------------|------------------|-----------------|-------|
| Background Primary | #f4f0e6 | #1a1917 | Main app background, subtle gradients |
| Surface | #fef9ef | #2c2b29 | Cards, modals, elevated elements |
| Text Primary | #2C2C2C | #e5e5e5 | Headings, body text |
| Text Secondary | #6B6B6B | #a3a3a3 | Subtitles, metadata, disabled states |
| Accent Primary | #C17A56 | #d99b7a | Buttons, icons, highlights (e.g., streaks, priorities) |
| Success | #7BB27A | #9fd99e | Positive feedback, progress bars, checkmarks |
| Warning | #FF6B35 | #ff8c5e | Alerts, predictions, energy dips |
| Info | #4F46E5 | #7f75ff | Insights, secondary actions |
| Neutral | #e5e7eb | #4b4b4b | Borders, dividers, inactive progress |
| Error | #DC3545 | #ff6666 | Errors, critical alerts (use sparingly) |

Code Example (Tailwind config.js):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary': '#f4f0e6',
        surface: '#fef9ef',
        'text-primary': '#2C2C2C',
        'text-secondary': '#6B6B6B',
        'accent-primary': '#C17A56',
        success: '#7BB27A',
        warning: '#FF6B35',
        info: '#4F46E5',
        neutral: '#e5e7eb',
        error: '#DC3545',
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
  --text-primary: #2C2C2C;
  --text-secondary: #6B6B6B;
  --accent-primary: #C17A56;
  --success: #7BB27A;
  --warning: #FF6B35;
  --info: #4F46E5;
  --neutral: #e5e7eb;
  --error: #DC3545;
}
```

## Typography
Use a clean, sans-serif font stack for readability. Sizes follow a modular scale (base 16px) with responsive adjustments (e.g., clamp for fluid typography). Weights: 400 (regular), 500 (medium), 700 (bold). Line height: 1.6 for body text.

- Font Family: Primary: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; Fallback: sans-serif.
- Sizes:
  - Base: 16px (1rem)
  - H1: 2.25rem (36px)
  - H2: 1.5rem (24px)
  - H3: 1.25rem (20px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)
  - X-Small: 0.75rem (12px)
- Effects: Subtle text shadows for depth on headings (e.g., 0 2px 4px rgba(0,0,0,0.1)).

Code Example (CSS):
```css
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
}

h1 {
  font-size: 2.25rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

## Spacing and Layout
Use a 4px base unit for consistency (rem-based for accessibility). Grid and flex for layouts. Breakpoints: Mobile (0-639px), Tablet (640-1023px), Desktop (1024px+). Max-width: 640px for mobile-first centering.

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
- Shadows: Soft elevations for depth—sm: 0px 2px 8px rgba(0,0,0,0.06); md: 0px 4px 15px rgba(0,0,0,0.08); lg: 0px 8px 25px rgba(0,0,0,0.12).
- Borders: Radius: xl (rounded-xl: 0.75rem/12px), 2xl (rounded-2xl: 1rem/16px); Width: 1-2px; Styles: solid/dashed/dotted for priorities.
- Effects: Transitions: all 300ms ease; Hovers: -translate-y-1, shadow-lg; Animations: pulse (scale/opacity), glow (shadow pulse).

Code Example (CSS Animations):
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0px 2px 8px rgba(0,0,0,0.06); }
  50% { box-shadow: 0px 2px 8px rgba(0,0,0,0.06), 0 0 20px rgba(123, 178, 122, 0.3); }
}
```

## Accessibility and Variations
- Contrast: All text passes WCAG AA (use tools like WebAIM Contrast Checker).
- Variants: High-contrast mode (increase borders/shadows); Reduced motion (disable animations via prefers-reduced-motion).
- Dark Mode: Invert palette (e.g., backgrounds darken, text lightens); Use media queries.
- Responsiveness: Fluid typography (clamp), stack layouts on mobile.

Code Example (Media Query):
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1917;
    /* ... other inversions */
  }
}
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
```

## Implementation Guidelines
- Apply via: Tailwind classes (e.g., bg-surface, text-text-primary) or CSS vars in components.
- Tools: Storybook for component testing; Figma for mocks (export variables).
- Maintenance: Update via design tokens (JSON file); Audit with Lighthouse for perf/accessibility.
- Best Practices: Use semantic HTML; Add ARIA labels; Optimize for touch (min 44px targets).

## References and Next Steps
- Related Docs: Integrate with `ui-rules.md` for interactions; `tech-stack.md` for Tailwind setup.
- Tools: Lucide Icons docs; Tailwind CSS playground.
- Next: Prototype in Figma; Test on devices; Extend for dark mode if needed.