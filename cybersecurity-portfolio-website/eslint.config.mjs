import nextConfig from "eslint-config-next/core-web-vitals"

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      // Downgrade to warnings — real issues to fix over time
      "@next/next/no-img-element": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/rules-of-hooks": "warn",

      // React compiler is experimental, disable for now
      "react-compiler/react-compiler": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/immutability": "off",

      // Too noisy for existing codebase
      "react/no-unescaped-entities": "off",
    },
  },
]

export default eslintConfig
