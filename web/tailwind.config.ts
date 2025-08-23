// This file is intentionally kept minimal.
// The Tailwind CSS build process in this environment has issues reading theme customizations.
// Custom theme values (e.g., colors) are defined as CSS variables in globals.css
// and applied using Tailwind's arbitrary value syntax, e.g., bg-[var(--color-primary)].

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
