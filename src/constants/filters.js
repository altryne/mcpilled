import PropTypes from "prop-types";

const FILTERS = {
  // Event types / themes
  theme: {
    update: "Protocol Update",
    milestone: "Protocol Milestone",
    adoption: "Adoption",
    warning: "Warning",
    goodToKnow: "Good to Know",
    industryNews: "Industry News",
    mcp: "MCP Server",
    mcpClient: "MCP Client",
  },
  
  // Tool categories
  category: {
    productivity: "Productivity",
    webSearch: "Web Search",
    official: "Official",
    database: "Database",
    financial: "Financial Data",
    llms: "LLMs",
    commandExecution: "Command Execution",
    location: "Weather & Location",
    memory: "Knowledge & Memory",
    browser: "Browser Automation",
    os: "OS Automation",
    communication: "Communication",
    devTools: "Developer Tools",
    entertainment: "Entertainment & Media",
    calendar: "Calendar Management",
    security: "Security",
    monitoring: "Monitoring",
    virtualization: "Virtualization",
    cloudStorage: "Cloud Storage",
    cloudPlatform: "Cloud Platforms",
  },
  
  // Server types
  server: {
    officialServers: "Official Servers",
    researchData: "Research And Data",
    aiChatbot: "AI Chatbot",
    fileSystems: "File Systems",
    customerData: "Customer Data Platforms",
  },
};

export const EMPTY_FILTERS = {
  theme: [],
  category: [],
  server: [],
  sort: "Descending",
};

export const FILTER_CATEGORIES = ["theme", "category", "server"];

const ThemePropType = PropTypes.oneOf(Object.keys(FILTERS.theme));
const CategoryPropType = PropTypes.oneOf(Object.keys(FILTERS.category));
const ServerPropType = PropTypes.oneOf(Object.keys(FILTERS.server));

export const FiltersPropType = PropTypes.shape({
  theme: PropTypes.arrayOf(ThemePropType).isRequired,
  category: PropTypes.arrayOf(CategoryPropType).isRequired,
  server: PropTypes.arrayOf(ServerPropType).isRequired,
  sort: PropTypes.oneOf(["Descending", "Ascending"]).isRequired,
});

export default FILTERS;
