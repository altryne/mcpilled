import React from "react";
import useGA from "../hooks/useGA";
import Link from "next/link";

import CustomHead from "../components/CustomHead";
import SimpleHeader from "../components/SimpleHeader";
import BackBar from "../components/BackBar";
import ExternalLink from "../components/ExternalLink";
import Footer from "../components/Footer";

export default function WhatIsWeb3() {
  useGA();
  return (
    <>
      <CustomHead
        title="About – MCPilled"
        description="About the MCPilled.com project"
        urlPath="about"
      />
      <SimpleHeader>About</SimpleHeader>
      <BackBar />
      <div className="content-wrapper">
        <article className="generic-page longform-text">
          <h3>What is this?</h3>
          <p>
            MCPilled.com is a community-driven site to help you learn about Anthropic's Model Context Protocol (MCP). We've compiled FAQs, a timeline of key events, top resources, and tips on automating posts for our @getMCPilled social accounts. Dive in and get MCP‑pilled!
          </p>
          <p>
            This website serves as a friendly introduction and hub for all things MCP. Our goal is to welcome you into the MCP community, whether you're a developer or just curious, and help you stay up-to-date with this emerging standard.
          </p>
          <h3>Who am I?</h3>
          <p>
            I'm Alex Volkov, an AI Evangelist with{" "}
            <ExternalLink href="https://wandb.ai/">
              Weights & Biases
            </ExternalLink>{" "}
            and an MCP enthusiast. You can find me on{" "}
            <ExternalLink href="https://twitter.com/altryne">
              Twitter/X
            </ExternalLink>{" "}
            where I regularly share updates about MCP and other AI developments.
          </p>
          <p>
            This website is a community-driven project created by volunteers who are passionate about MCP. It is not an official Anthropic site, but rather an initiative by members of the MCP community aiming to spread knowledge and encourage participation.
          </p>
          <h3>Contributing</h3>
          <p>
            If you'd like to contribute content or updates to MCPilled.com, you're welcome – this is a community effort! The code for this site is open source and available on{" "}
            <ExternalLink href="https://github.com/altryne/mcpilled">
              GitHub
            </ExternalLink>
            . Feel free to submit pull requests or open issues with suggestions.
          </p>
          <p>
            You can also contribute by joining the conversation on our{" "}
            <ExternalLink href="https://discord.gg/mcpilled">
              Discord server
            </ExternalLink>{" "}
            or by following and engaging with our{" "}
            <ExternalLink href="https://twitter.com/getMCPilled">
              Twitter/X account
            </ExternalLink>
            .
          </p>
          <h3>Privacy</h3>
          <p>
            The site uses Google Analytics, primarily for understanding user engagement. All IP data is anonymized, no advertising features are enabled, and data retention is set to the minimum value (14 months).
          </p>
        </article>
      </div>
      <Footer />
    </>
  );
}
