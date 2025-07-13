# UI Rules: Minimalist, Mobile-First Design Principles

## Overview
This document outlines the UI design principles for the TodoList web app, building on @project-overview.md, @user-flow.md, and @tech-stack.md. The focus is on a minimalist aesthetic with mobile-first responsiveness, subtle animations, and intuitive interactions to enhance usability for task management. Principles emphasize hierarchy for organized views, consistency for predictability, and feedback for user confidence. All designs prioritize accessibility (WCAG 2.2), performance, and integration with React/Next.js, Tailwind CSS, and Shadcn/UI components.

The UI aims to reduce cognitive load: Clean layouts for hierarchical task views, quick interactions for focus selection, and visual cues for completions/logs. Subtle animations (e.g., fade-ins) guide without distraction, with reduced-motion support.

## Core Principles

### 1. Hierarchy
- **Description**: Structure content to reflect importance and relationships, using visual layers to guide attention (e.g., headers > categories > tasks).
- **Guidelines**: Use accordions for nested views (e.g., business headers expanding to categories); Prioritize daily focus in a prominent sidebar; Employ size/color for emphasis (e.g., bold titles, muted metadata).
- **Mobile-First**: Stack vertically on small screens; Expand to grids on larger devices.
- **Best Practices**: Follow Fitts's Law—make frequent actions (e.g., add to focus) easily tappable; Use whitespace to separate levels.
- **Implementation**: Leverage Shadcn Accordion for hierarchies; Tailwind classes like text-lg for headings.

### 2. Consistency
- **Description**: Maintain uniform patterns across the app for familiarity, reducing learning curve (e.g., consistent button styles, navigation).
- **Guidelines**: Standardize elements: Checkboxes for completions everywhere; Color-coded priorities (e.g., red for high); Uniform modals for task creation/editing.
- **Mobile-First**: Ensure touch targets ≥44px; Consistent breakpoints (e.g., sm: for mobile, md: for tablet).
- **Best Practices**: Define reusable components (e.g., TaskCard); Align with theme-rules.md for styling.
- **Implementation**: Use Tailwind's theme extensions; React context for global styles.

### 3. Feedback
- **Description**: Provide immediate, clear responses to user actions to build trust (e.g., loading spinners, success toasts).
- **Guidelines**: Optimistic updates for completions (strikethrough instantly, sync in background); Subtle animations (e.g., 300ms fade for new tasks); Error messages inline (e.g., "Invalid due date").
- **Mobile-First**: Vibration feedback on touch devices for completions; Ensure animations don't hinder performance.
- **Best Practices**: Use ARIA live regions for screen readers; Respect prefers-reduced-motion.
- **Implementation**: Shadcn Toast for notifications; React Transition Group for subtle effects.

## Additional Guidelines
- **Responsiveness**: Use Tailwind's responsive utilities (e.g., sm:flex-row); Test on devices with Lighthouse.
- **Animations**: Subtle only (e.g., scale 1.05 on hover); Duration <400ms; Disable via media query.
- **Accessibility**: High contrast (4.5:1); Keyboard navigation; Alt text for icons/images.
- **Performance**: Lazy-load non-critical components; Optimize images/SVGs.
- **Integration with Phases**: Apply in MVP for core views; Refine in enhancements based on feedback.

## References and Next Steps
- Related: @theme-rules.md for visuals; @tech-stack.md for tools.
- Next: Prototype in Figma; Audit with WAVE tool for WCAG compliance. 