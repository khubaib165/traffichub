# PushFlow Design System Documentation

This document outlines the complete design system used throughout the PushFlow platform. All components should adhere to these guidelines.

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Components](#components)
5. [Interactions](#interactions)
6. [Dark & Light Modes](#dark--light-modes)

---

## Color System

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Brand Purple | #7C3AED | Primary CTA, active states, highlights |
| Brand Purple Dark | #5B21B6| Hover states, darker accents |
| Brand Purple Light | #EDE9FE | Light backgrounds, subtle highlights |
| Brand Cyan | #06B6D4 | Secondary CTA, charts (secondary series) |
| Brand Green | #10B981 | Success, positive metrics, conversions |
| Brand Amber | #F59E0B | Warning, paused states, caution |
| Brand Red | #EF4444 | Danger, errors, negative metrics |

### Dark Theme (Default)

| Name | Hex | Usage |
|------|-----|-------|
| Background | #0F0F1A | Page background |
| Surface | #16162A | Sidebar, topbar background |
| Card | #1E1E35 | Panel and card backgrounds |
| Border Dark | rgba(255, 255, 255, 0.08) | Subtle dividers |
| Text Primary | #FFFFFF | Main text |
| Text Secondary | rgba(255, 255, 255, 0.6) | Body text, labels |
| Text Muted | rgba(255, 255, 255, 0.35) | Disabled, hints, timestamps |

### CSS Custom Properties

All colors are defined as CSS variables in `src/styles/globals.css`:

```css
:root {
  --brand-purple: #7c3aed;
  --brand-cyan: #06b6d4;
  --bg-dark: #0f0f1a;
  --text-primary: #ffffff;
  /* ... etc */
}
```

---

## Typography

### Font Families

- **Sans Serif**: Inter (primary UI font)
- **Monospace**: JetBrains Mono (code, API keys, IDs)

### Font Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Label | 12px | 600 | 16px | Small labels, badges |
| Small | 13px | 400 | 18px | Small text, timestamps |
| Body | 14px | 400 | 20px | default text |
| Lead | 16px | 500 | 24px | Section text |
| H3 | 20px | 600 | 28px | Section headings |
| H2 | 24px | 700 | 32px | Page headings |
| H1 | 32px | 700 | 40px | Main heading |

### Font Weights

- **400**: Regular (body text)
- **500**: Medium (lead text, medium emphasis)
- **600**: Semi-bold (labels, strong emphasis)
- **700**: Bold (headings only)

---

## Spacing & Layout

### Spacing Scale

All spacing follows an 8px base scale:

| Value | Size | Usage |
|-------|------|-------|
| 4xs | 2px | hairline gaps |
| 3xs | 4px | tight spacing |
| 2xs | 6px | small gaps |
| xs | 8px | default padding |
| sm | 12px | standard padding |
| md | 16px | sections |
| lg | 24px | major sections |
| xl | 32px | page sections |
| 2xl | 48px | large spacing |
| 3xl | 64px | maximum spacing |

### Layout Rules

- **Sidebar Width**: 256px (expanded), 64px (collapsed)
- **Topbar Height**: 64px
- **Container Max Width**: 1200px
- **Grid Columns**: 12 columns (responsive)
- **Card Radius**: 8px (default), 12px (large)
- **Focus Ring**: 2px solid purple, 2px offset

---

## Components

### Button

**Variants:**
- **Primary**: Purple gradient, white text, rounded corners
- **Secondary**: Card background with border, text primary
- **Danger**: Red background, white text
- **Ghost**: Transparent, cyan text on hover

**Sizes:**
- **SM**: 8px 12px, 12px font
- **MD**: 12px 16px, 14px font (default)
- **LG**: 16px 24px, 16px font

**States:**
- Normal: Full opacity
- Hover: Slightly lighter
- Active: Scale(0.97)
- Disabled: 50% opacity, no cursor

**Example:**
```tsx
<Button variant="primary" size="md">
  Create Campaign
</Button>
```

### Input

**Features:**
- Searchable with debounce
- Error state with red border
- Icon support (left side)
- Label above field
- Placeholder text

**States:**
- Default: Border + transparent bg
- Focus: Purple border + glow
- Error: Red border + error message
- Disabled: 50% opacity

**Example:**
```tsx
<Input
  label="Campaign Name"
  placeholder="Enter name..."
  error={errors.name}
/>
```

### Card

**Variants:**
- **Default**: Solid card background with border
- **Glass**: Glassmorphism with backdrop blur
- **Gradient**: Gradient overlay from purple to cyan

**Padding:**
- **SM**: 12px
- **MD**: 16px (default)
- **LG**: 24px

**Example:**
```tsx
<Card variant="glass" padding="lg">
  Premium content
</Card>
```

### Badge

**Status Variants:**
- **Active**: Green background + text
- **Paused**: Amber background + text
- **Pending**: Purple background + text
- **Rejected**: Red background + text
- **Draft**: Purple background + text

**Sizes:**
- **SM**: 12px font, 2px vertical padding
- **MD**: 14px font, 4px vertical padding

**Features:**
- Colored dot indicator
- Pill-shaped border-radius
- Uppercase text

**Example:**
```tsx
<Badge status="active" label="Active" />
```

### StatCard

**Features:**
- Icon (colored)
- Metric label
- Large number display
- percent change with up/down indicator
- Color-coded change (green/red)

**Example:**
```tsx
<StatCard
  icon={<Zap />}
  label="Today's Spend"
  value="34.20"
  change={12.4}
  currency
/>
```

### Skeleton

**Variants:**
- **Text**: Rectangular, 75% width
- **Circle**: Square, used for avatars
- **Rectangular**: Full width (default)

**Animation:**
- Shimmer effect left to right
- 2-second cycle time
- Smooth gradient sweep

**Example:**
```tsx
<Skeleton variant="text" />
```

### Layout Components

#### Sidebar
- Width: 256px (expanded), 64px (collapsed, MD+)
- Background: Surface color
- Left border on active nav items
- Logo at top, user info at bottom
- Mobile: Slide-in drawer with overlay

#### Topbar
- Height: 64px
- Components: Balance chip, notifications, theme toggle, user menu
- Sticky positioning
- Responsive hamburger menu on mobile

---

## Interactions

### Hover Effects
- Buttons: Slight opacity change or scale
- Cards: Scale 1.01, subtle shadow increase
- Links: Underline appears, color brightens

### Focus States
- All interactive elements: 2px solid purple outline
- 2px offset from element
- Keyboard navigation fully supported

### Transitions
- Default: all 0.2s ease
- Fast: all 0.1s ease (micro-interactions)
- Slow: all 0.3s ease (page transitions)

### Animations
- **Count-up**: Numbers animate to final value on render
- **Shimmer**: Skeleton loaders animate
- **Slide-in**: Components fade in from below
- **Scale**: Buttons scale down on press

### Accessibility
- ARIA labels on all icon buttons
- Semantic HTML throughout
- Color never the only indicator (paired with icons/text)
- Minimum contrast ratio of 4.5:1
- Touch targets minimum 44x44px

---

## Dark & Light Modes

### Theme Provider

The app uses CSS custom properties for theme switching:

```tsx
// Set theme
document.documentElement.setAttribute("data-theme", "light");

// CSS adapts via:
[data-theme="light"] {
  --bg-dark: var(--bg-light);
  --text-primary: var(--text-light-primary);
  /* ... etc */
}
```

### Light Mode Overrides

In light mode, certain colors adjust:
- Background: Light purple tint instead of dark blue
- Text: Dark colors instead of white
- Surfaces: White instead of dark gray
- Borders: Subtle black instead of white

### Theme Toggle

Available in the topbar (sun/moon icon) and preferences. Preference stored in localStorage.

---

## Usage Examples

### Creating a New Component

```tsx
"use client";

import { colors, typography, spacing } from "@/styles/design-tokens";
import { Button } from "@/components/ui/Button";

interface MyComponentProps {
  title: string;
  description?: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  description 
}) => {
  return (
    <div className="p-4 rounded-lg bg-bg-card border border-border-dark">
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-muted mb-4">
          {description}
        </p>
      )}
      <Button variant="primary">
        Take Action
      </Button>
    </div>
  );
};
```

### Using Design Tokens in JavaScript/TypeScript

```typescript
import { colors, shadows, transitions } from "@/styles/design-tokens";

const chartConfig = {
  colors: {
    series1: colors.brandPurple,
    series2: colors.brandCyan,
    series3: colors.brandGreen,
  },
};

const containerStyle = {
  boxShadow: shadows.glowPurple,
  transition: transitions.default,
};
```

### Custom Styling with Tailwind

Use double brackets for custom values:

```tsx
<div className="bg-[#7C3AED] text-white p-[var(--spacing-md)]">
  Custom styled content
</div>
```

---

## Best Practices

1. **Always use design tokens** - Never hardcode colors/values
2. **Maintain consistent spacing** - Use the spacing scale
3. **Follow naming conventions** - Component names should be descriptive
4. **Accessibility first** - Every interactive element must be keyboard accessible
5. **Mobile first** - Design mobile, then enhance for larger screens
6. **Test with screen readers** - Use real assistive technology
7. **Document components** - Include prop descriptions and examples
8. **Reuse components** - Avoid duplication, extend when needed
9. **Keep motion minimal** - Respect prefers-reduced-motion
10. **Test color contrast** - Meet WCAG AA standards minimum

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Recharts Documentation](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
