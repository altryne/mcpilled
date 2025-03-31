import React from "react";
import useGA from "../hooks/useGA";

import CustomHead from "../components/CustomHead";
import BackBar from "../components/BackBar";
import ExternalLink from "../components/ExternalLink";
import Footer from "../components/Footer";
import SimpleHeader from "../components/SimpleHeader";

export default function Attribution() {
  useGA();

  return (
    <>
      <CustomHead
        title="Attribution – MCPilled"
        description="Attribution for content, code, and resources used in the MCPilled.com project"
        urlPath="attribution"
      />
      <SimpleHeader className="attribution-header">Attribution</SimpleHeader>
      <BackBar />
      <div className="content-wrapper">
        <article className="generic-page longform-text">
          <p>
            MCPilled.com is a community-driven resource for the Model Context Protocol (MCP). The site content is licensed under the{" "}
            <ExternalLink
              rel="license"
              href="http://creativecommons.org/licenses/by/4.0/"
            >
              Creative Commons Attribution 4.0 International License
            </ExternalLink>
            . Feel free to reuse content on this site under those terms.
          </p>
          <p>
            Source code is{" "}
            <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/blob/main/LICENSE">
              MIT-licensed
            </ExternalLink>{" "}
            and available in the{" "}
            <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/tree/main/mcp">
              Anthropic Cookbook repository
            </ExternalLink>
            .
          </p>
          <h3>Content and Resources</h3>
          <p>
            MCPilled.com draws from several key resources:
          </p>
          <ul>
            <li>
              <ExternalLink href="https://docs.anthropic.com/claude/docs/model-context-protocol">
                <span>Anthropic's MCP Documentation</span>
              </ExternalLink>
              <span> - Official documentation and guides for the Model Context Protocol</span>
            </li>
            <li>
              <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/tree/main/mcp">
                <span>Anthropic Cookbook MCP Section</span>
              </ExternalLink>
              <span> - Examples, tutorials, and implementation guides</span>
            </li>
            <li>
              <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/blob/main/mcp/quickstart.ipynb">
                <span>MCP Quickstart Guide</span>
              </ExternalLink>
              <span> - Introductory tutorial for getting started with MCP</span>
            </li>
          </ul>
          
          <h3>Site Maintenance</h3>
          <p>
            MCPilled.com is maintained by Alex Volkov (<ExternalLink href="https://twitter.com/altryne"><span>@altryne</span></ExternalLink>), AI Evangelist at Weights & Biases. The site welcomes contributions from the community.
          </p>
          
          <h3>Contributing</h3>
          <p>
            If you'd like to contribute to MCPilled.com, please visit our{" "}
            <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/tree/main/mcp">
              <span>GitHub repository</span>
            </ExternalLink>{" "}
            or check out the{" "}
            <a href="/contribute">Contribute page</a>{" "}
            for more information.
          </p>
          
          <h3>Community</h3>
          <p>
            Join the MCPilled community:
          </p>
          <ul>
            <li>
              <ExternalLink href="https://discord.gg/mcpilled">
                <span>Discord</span>
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://twitter.com/getMCPilled">
                <span>Twitter</span>
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.reddit.com/r/ModelContextProtocol/">
                <span>Reddit</span>
              </ExternalLink>
            </li>
          </ul>
        </article>
      </div>
      <Footer />
    </>
  );
}
