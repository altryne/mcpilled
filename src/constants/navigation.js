export const SOCIAL = [
  {
    label: "Twitter",
    href: "https://twitter.com/mcpilled",
    icon: "fab fa-twitter",
  },
  {
    label: "GitHub",
    href: "https://github.com/anthropics/anthropic-cookbook/tree/main/mcp",
    icon: "fab fa-github",
  },
  {
    label: "Discord",
    href: "https://discord.gg/mcpilled",
    icon: "fab fa-discord",
  }
];

export const NAVIGATION = [
  {
    label: "About",
    key: "about-header",
    children: [
      {
        label: "About this project",
        short: "About",
        path: "/about",
      },
      {
        label: "MCP Overview",
        short: "Overview",
        path: "/overview",
      },
      {
        label: "What is MCP?",
        path: "/what",
      },
      { label: "FAQ", path: "/faq" },
      {
        label: "Glossary",
        path: "/glossary",
      },
      {
        label: "License and attribution",
        short: "License",
        path: "/attribution",
      },
    ],
  },
  {
    label: "Follow",
    key: "follow-header",
    children: [
      ...SOCIAL,
      {
        label: "RSS",
        path: "/feed.xml",
      },
    ],
  },
  {
    label: "Resources",
    path: "/resources",
  },
  {
    label: "Contribute",
    path: "/contribute",
  },
  {
    label: "Documentation",
    href: "https://docs.anthropic.com/claude/docs/model-context-protocol",
  },
];
