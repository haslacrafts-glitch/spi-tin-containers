import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "metallic-silver": "#E2E4E9",
        "on-background": "#1b1c1c",
        "surface-dim": "#dcd9d9",
        primary: "#9e1000",
        "industrial-gray": "#F4F4F4",
        "on-surface": "#1b1c1c",
        "trust-gold": "#C5A059",
        "surface-variant": "#e5e2e1",
        "primary-fixed": "#ffdad4",
        "surface-container-high": "#eae7e7",
        "surface-container-low": "#f6f3f2",
        "outline-variant": "#e3beb7",
        "on-primary-container": "#ffaa9b",
        "primary-fixed-dim": "#ffb4a6",
        secondary: "#5f5e5e",
        "steel-blue": "#5f5e5e",
        "on-primary": "#ffffff",
        background: "#fcf9f8",
        "on-surface-variant": "#5b403b",
        "primary-container": "#730900",
        "surface-bright": "#fcf9f8",
        surface: "#fcf9f8",
        tertiary: "#363738",
        "on-tertiary": "#ffffff",
        "surface-container": "#f0eded",
        error: "#ba1a1a",
        "surface-container-lowest": "#ffffff",
        "secondary-container": "#e4e2e1",
        "inverse-primary": "#ffb4a6",
        "on-error": "#ffffff",
        "surface-tint": "#b62410",
        outline: "#8f706a",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      spacing: {
        gutter: "24px",
        "section-gap": "80px",
        "margin-mobile": "16px",
        "container-max": "1280px",
        "margin-desktop": "40px",
        unit: "8px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      fontFamily: {
        display: ["var(--font-hanken)", "sans-serif"],
        body: ["var(--font-plex)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "label-mono": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "500" },
        ],
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "title-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};

export default config;
