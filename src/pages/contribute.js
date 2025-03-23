import React from "react";
import useGA from "../hooks/useGA";

import BackBar from "../components/BackBar";
import CustomHead from "../components/CustomHead";
import ExternalLink from "../components/ExternalLink";
import Footer from "../components/Footer";
import SimpleHeader from "../components/SimpleHeader";

export default function Contribute() {
  useGA();

  return (
    <>
      <CustomHead
        title="Contribute to MCPilled"
        description="Contribute content, code, or ideas to MCPilled.com, the community hub for Model Context Protocol (MCP)."
        urlPath="contribute"
      />
      <SimpleHeader>Contribute</SimpleHeader>
      <BackBar />
      <div className="content-wrapper">
        <article className="generic-page longform-text">
          <h2>Contribute to MCPilled</h2>
          <p>
            MCPilled.com is a community-driven site, and we welcome contributions from anyone interested in the Model Context Protocol (MCP). There are several ways you can help improve this resource:
          </p>

          <h3>Suggest Content or Improvements</h3>
          <p>
            The best way to suggest additions or changes to this site is via GitHub Issues.{" "}
            <ExternalLink href="https://github.com/atryne/mcpilled/issues/new">
              <span>Open a new issue</span>
            </ExternalLink>{" "}
            with your suggestion, or{" "}
            <ExternalLink href="https://github.com/atryne/mcpilled/pulls">
              submit a pull request
            </ExternalLink>{" "}
            directly to the repository.
          </p>

          <h3>Share Your MCP Projects</h3>
          <p>
            Have you built something interesting with MCP? We'd love to feature it! Share your projects, tutorials, or use cases by{" "}
            <ExternalLink href="https://github.com/atryne/mcpilled/issues/new">
              <span>opening an issue</span>
            </ExternalLink>{" "}
            with the details of your project and how it uses MCP.
          </p>

          <h3>Tune in to ThursdAI live shows</h3>
          <p>
            Connect with the ThursdAI community where we cover MCP updates weekly
          </p>
          <ul>
            <li>
              <ExternalLink href="https://thursdai.news">
                <span>Subscribe to ThursdAI</span>
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://twitter.com/mcpilled">
                <span>Follow @mcpilled on Twitter</span>
              </ExternalLink>
            </li>
            
          </ul>

          <h3>Contribute Code</h3>
          <p>
            MCPilled.com is open source, and we welcome code contributions. Here are some ways you can help:
          </p>
          <ul>
            <li>Fix bugs or improve the website</li>
            <li>Improve documentation</li>
          </ul>
          <p>
            Check out the{" "}
            <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/tree/main/mcp">
              <span>MCP section of the Anthropic Cookbook</span>
            </ExternalLink>{" "}
            to get started.
          </p>

          <h3>Spread the Word</h3>
          <p>
            Help others discover MCP by sharing MCPilled.com with your network. The more people who know about and use MCP, the stronger the ecosystem becomes!
          </p>

          <h3>Contact</h3>
          <p>
            If you have questions, suggestions, or just want to chat about MCP, you can reach out to Alex Volkov (site creator) on{" "}
            <ExternalLink href="https://twitter.com/altryne">
              <span>Twitter</span>
            </ExternalLink>{" "}
            or via the{" "}
            <ExternalLink href="https://discord.gg/mcpilled">
              <span>MCPilled Discord</span>
            </ExternalLink>.
          </p>
        </article>
      </div>
      <Footer />
    </>
  );
}
