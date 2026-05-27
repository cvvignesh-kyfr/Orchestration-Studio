# KYFR — Desktop First Visual Lock System
## AI-Native Design Token + CSS Specification
### Version 1.0

> Desktop-first cinematic AI operating system visual language for KYFR.

---

# 1. Design Philosophy

KYFR is not a traditional fintech interface.

It behaves like:
- a cinematic operating system
- an ambient AI cockpit
- a behavioral intelligence layer
- a high-trust emotional financial interface

The UI language is intentionally:
- immersive
- spatial
- emotionally responsive
- glass-first
- motion-native
- depth-heavy
- desktop-premium

---

# 2. Core Visual Identity

## Primary Experience Themes

### Confident Mode
- High contrast
- Dark immersive cockpit
- Strong glow accents
- Aggressive depth
- AI command center feel

### Calm Mode
- Soft diffused interface
- Muted whites
- Reduced glow
- Low cognitive intensity
- Ambient wellness software feel

---

# 3. Canonical Color Tokens

```css
:root {
  --kyfr-black: #0B0B10;
  --kyfr-black-elevated: #12121A;
  --kyfr-black-soft: #1A1A1E;

  --kyfr-neon-green: #00FFA3;
  --kyfr-electric-pink: #FF0069;
  --kyfr-electric-purple: #6400D2;
  --kyfr-warning-orange: #FFA300;

  --kyfr-calm-bg: #F2F0F5;
  --kyfr-calm-surface: rgba(255,255,255,0.72);

  --kyfr-white: #FFFFFF;
}
```

---

# 4. Semantic Tokens

```css
:root {
  --bg-primary: var(--kyfr-black);
  --bg-secondary: var(--kyfr-black-elevated);
  --bg-surface: rgba(255,255,255,0.04);
  --bg-glass: rgba(255,255,255,0.05);

  --text-primary: rgba(255,255,255,0.95);
  --text-secondary: rgba(255,255,255,0.60);
  --text-muted: rgba(255,255,255,0.30);

  --border-subtle: rgba(255,255,255,0.06);
  --border-medium: rgba(255,255,255,0.12);

  --accent-positive: #00FFA3;
  --accent-alert: #FFA300;
  --accent-energy: #FF0069;
  --accent-intelligence: #6400D2;
}
```

---

# 5. Desktop-First Layout System

## Breakpoints

```css
--desktop-xl: 1600px;
--desktop-lg: 1440px;
--desktop: 1280px;
--laptop: 1024px;
--tablet: 768px;
--mobile: 480px;
```

## Desktop Canvas

```css
.desktop-shell {
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  padding: 32px;
}
```

---

# 6. Spacing System

```css
:root {
  --space-2: 2px;
  --space-4: 4px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-20: 20px;
  --space-24: 24px;
  --space-32: 32px;
  --space-40: 40px;
  --space-48: 48px;
  --space-64: 64px;
  --space-80: 80px;
}
```

---

# 7. Typography System

## Recommended Fonts
- Inter
- Satoshi
- Geist
- SF Pro Display

## Type Scale

```css
:root {
  --text-hero: 72px;
  --text-display: 56px;
  --text-h1: 42px;
  --text-h2: 32px;
  --text-h3: 24px;
  --text-title: 20px;
  --text-body-lg: 18px;
  --text-body: 16px;
  --text-caption: 13px;
  --text-micro: 11px;
}
```

---

# 8. Glassmorphism System

## Canonical Glass

```css
.glass {
  background: rgba(255,255,255,0.05);

  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);

  border: 1px solid rgba(255,255,255,0.08);

  box-shadow:
    0 8px 32px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.06);
}
```

## Elevated Glass

```css
.glass-elevated {
  background: rgba(18,18,26,0.92);

  backdrop-filter: blur(32px) saturate(180%);

  border: 1px solid rgba(255,255,255,0.10);

  box-shadow:
    0 40px 100px rgba(0,0,0,0.85),
    0 12px 40px rgba(0,0,0,0.40),
    inset 0 1px 0 rgba(255,255,255,0.06);
}
```

---

# 9. Blur System

```css
:root {
  --blur-sm: 8px;
  --blur-md: 16px;
  --blur-lg: 24px;
  --blur-xl: 32px;
  --blur-xxl: 48px;
}
```

---

# 10. Radius System

```css
:root {
  --radius-sm: 14px;
  --radius-md: 22px;
  --radius-lg: 32px;
  --radius-xl: 40px;
  --radius-2xl: 48px;
  --radius-full: 999px;
}
```

---

# 11. Shadow System

```css
--shadow-sm: 0 4px 12px rgba(0,0,0,0.16);
--shadow-md: 0 12px 32px rgba(0,0,0,0.28);
--shadow-lg: 0 20px 50px rgba(0,0,0,0.50);
--shadow-xl: 0 40px 100px rgba(0,0,0,0.90);
```

---

# 12. Glow System

```css
.glow-green {
  box-shadow:
    0 0 40px rgba(0,255,163,0.30),
    0 0 80px rgba(0,255,163,0.12);
}

.glow-pink {
  box-shadow:
    0 0 40px rgba(255,0,105,0.28),
    0 0 80px rgba(255,0,105,0.10);
}
```

---

# 13. Motion System

## Motion Curve

```css
transition-timing-function:
  cubic-bezier(0.22, 1, 0.36, 1);
```

## Durations

```css
--motion-fast: 180ms;
--motion-base: 320ms;
--motion-slow: 540ms;
--motion-cinematic: 900ms;
```

---

# 14. Ambient Gradient System

```css
background:
radial-gradient(circle at top left,
rgba(0,255,163,0.12),
transparent 40%),

radial-gradient(circle at top right,
rgba(255,0,105,0.08),
transparent 40%),

radial-gradient(circle at bottom center,
rgba(100,0,210,0.12),
transparent 60%),

#0B0B10;
```

---

# 15. Canonical KYFR Button

```css
.kyfr-button {
  height: 56px;
  padding: 0 24px;

  border-radius: 999px;

  background: rgba(255,255,255,0.06);

  border: 1px solid rgba(255,255,255,0.08);

  backdrop-filter: blur(24px);

  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  transition:
    all 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

# 16. Tailwind Preset

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        kyfr: {
          black: '#0B0B10',
          elevated: '#12121A',
          green: '#00FFA3',
          pink: '#FF0069',
          purple: '#6400D2',
          orange: '#FFA300',
          calm: '#F2F0F5'
        }
      },

      borderRadius: {
        kyfrSm: '14px',
        kyfrMd: '22px',
        kyfrLg: '32px',
        kyfrXl: '40px',
        kyfr2xl: '48px'
      },

      backdropBlur: {
        kyfr: '24px',
        kyfrxl: '32px'
      },

      boxShadow: {
        kyfr:
          '0 20px 50px rgba(0,0,0,0.5)',

        kyfrxl:
          '0 40px 100px rgba(0,0,0,0.9)'
      }
    }
  }
}
```

---

# 17. Agentic IDE Visual Lock

## MUST PRESERVE
- glassmorphism system
- dark cinematic aesthetic
- desktop-first spacing
- large radii
- ambient gradients
- layered shadows
- immersive depth
- premium typography
- emotional motion language

## MUST NOT INTRODUCE
- default shadcn themes
- generic Tailwind layouts
- enterprise blue palettes
- flat cards
- low blur interfaces
- sharp corners
- cramped layouts
- simplistic fintech UI patterns

---

# Final Principle

> “KYFR should feel like a living AI financial operating system with emotional intelligence and cinematic spatial depth.”
