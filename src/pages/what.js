import useGA from "../hooks/useGA";

import BackBar from "../components/BackBar";
import CustomHead from "../components/CustomHead";
import ExternalLink from "../components/ExternalLink";
import Footer from "../components/Footer";
import SimpleHeader from "../components/SimpleHeader";

export default function WhatIsMCP() {
  useGA();
  return (
    <>
      <CustomHead
        title="What is MCP? – MCPilled"
        description="Model Context Protocol (MCP) is an open standard (created by Anthropic) that lets AI assistants connect to external data sources and tools in a unified way. Think of MCP like a 'USB-C port for AI applications' – instead of custom integrations for every data source, MCP provides one standardized interface."
        urlPath="what"
      />
      <SimpleHeader>What is MCP?</SimpleHeader>
      <BackBar />
      <div className="content-wrapper">
        <article className="generic-page what-page longform-text">
          <p>
            Model Context Protocol (MCP) is an open standard created by Anthropic that lets AI assistants connect to external data sources and tools in a unified way. Think of MCP like a "USB-C port for AI applications" – instead of custom integrations for every data source, MCP provides one standardized interface. This means an AI (like Anthropic's Claude) can plug into different systems (files, databases, APIs, etc.) through MCP and securely exchange information.
          </p>
          <p>
            At its core, MCP solves the problem of how AI models access the context they need to be truly helpful. Before MCP, developers had to create custom integrations for each combination of AI model and data source – a time-consuming and inefficient approach. MCP standardizes these connections, making it much easier to build AI applications that can access diverse information sources.
          </p>
          <p>
            MCP works on a simple client–server model for AI context sharing. Here's a high-level view of how it functions:
          </p>
          <ul>
            <li><strong>MCP Servers:</strong> These are lightweight programs or connectors that interface with a specific data source or service (for example, a Google Drive MCP server, a Slack MCP server, a GitHub repo server, etc.). Each server exposes certain capabilities (files, search queries, database access, etc.) through the MCP standard.</li>
            <li><strong>MCP Client/Host:</strong> This is the AI-powered application (such as Claude Desktop, an IDE with an AI assistant, or any LLM app) that wants to use external data. The host connects to one or more MCP servers using the protocol. Essentially, the AI app "speaks" MCP to ask servers for information or to perform actions.</li>
          </ul>
          <p>
            When connected, the MCP servers advertise what they can do (their available "tools" and data) in a standardized format. The AI client can discover these and invoke them. For example, a Claude AI client could connect to an MCP server for GitHub and then fetch code from a repo or get a file listing via simple MCP commands. All of this happens through a unified protocol interface, so the AI doesn't need custom code for each new tool – it just uses MCP.
          </p>
          <p>
            Key benefits of MCP include:
          </p>
          <ul>
            <li><strong>Standardization:</strong> One protocol for connecting AI to any data source</li>
            <li><strong>Ecosystem of Integrations:</strong> Growing library of reusable connectors for common services</li>
            <li><strong>Flexibility:</strong> Swap AI models without losing data connections</li>
            <li><strong>Better AI Responses:</strong> AI can access up-to-date, relevant information</li>
            <li><strong>Security and Control:</strong> Keep data access controlled within your infrastructure</li>
          </ul>
          <p>
            This is intended to be a brief overview of MCP. Here are some resources where you can learn more:
          </p>
          <h3>Official Documentation</h3>
          <ul>
            <li>
              <ExternalLink href="https://docs.anthropic.com/claude/docs/model-context-protocol">
                <span>Anthropic MCP Documentation</span>
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/tree/main/mcp">
                <span>Anthropic MCP Cookbook</span>
              </ExternalLink>
            </li>
          </ul>
          <h3>Tutorials and Guides</h3>
          <ul>
            <li>
              <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/blob/main/mcp/quickstart.ipynb">
                <span>MCP Quickstart Guide</span>
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/tree/main/mcp/example_servers">
                <span>Example MCP Servers</span>
              </ExternalLink>
            </li>
          </ul>
          <h3>Community Resources</h3>
          <ul>
            <li>
              <ExternalLink href="https://discord.gg/mcpilled">
                <span>MCP Discord Community</span>
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.reddit.com/r/ModelContextProtocol/">
                <span>r/ModelContextProtocol Subreddit</span>
              </ExternalLink>
            </li>
          </ul>
        </article>
      </div>
      <Footer />
    </>
  );
}
