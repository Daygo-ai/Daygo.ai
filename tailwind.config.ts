import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        "bg-elevated": "#111111",
        surface: "#181818",
        "surface-hi": "#202020",

        text: "#F5F5F2",
        "text-muted": "#888880",
        "text-soft": "#C8C8C0",

        accent: {
          DEFAULT: "#CDEE3C",
          deep: "#A8C820",
          on: "#161913",
        },

        ink: {
          DEFAULT: "#161913",
          soft: "#2A2D22",
        },

        warn: "#F19770",
        bad: "#F2647D",

        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        destructive: "var(--destructive)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        display: ["Geist", "ui-sans-serif", "system-ui", "-apple-system"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system"],
      },
    },
  },
  plugins: [],
};

export default config;
