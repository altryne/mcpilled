import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import BackBar from "../components/BackBar";
import CustomHead from "../components/CustomHead";
import SimpleHeader from "../components/SimpleHeader";
import clsx from "clsx";

export default function FAQ() {
  const [highlightedEntry, setHighlightedEntry] = useState();
  useEffect(() => {
    if (window.location.hash) {
      setHighlightedEntry(window.location.hash.slice(1));
    }
  }, [setHighlightedEntry]);

  return (
    <>
      <CustomHead
        title="FAQ – MCPilled"
        description="Frequently asked questions about Model Context Protocol (MCP)"
        urlPath="faq"
      />
      <SimpleHeader>FAQ</SimpleHeader>
      <BackBar />
      <div className="content-wrapper">
        <article className="generic-page longform-text">
          <div
            id="what-is-mcp"
            className={clsx("faq-entry", {
              highlighted: highlightedEntry === "what-is-mcp",
            })}
          >
            <h3>What is MCP?</h3>
            <p>
              Model Context Protocol (MCP) is an open standard (created by Anthropic) that lets AI assistants connect to external data sources and tools in a unified way. Think of MCP like a "USB-C port for AI applications" – instead of custom integrations for every data source, MCP provides one standardized interface. This means an AI (like Anthropic's Claude) can plug into different systems (files, databases, APIs, etc.) through MCP and securely exchange information. In short, MCP enables AI models to access the context and data they need from various apps or repositories via a common protocol.
            </p>
          </div>
          <div
            id="website-purpose"
            className={clsx("faq-entry", {
              highlighted: highlightedEntry === "website-purpose",
            })}
          >
            <h3>What is this website for?</h3>
            <p>
              MCPilled.com is a friendly introduction and hub for all things MCP. The site was created by MCP enthusiasts in the community to educate newcomers about the protocol and its ecosystem. Here you'll find simple explanations, an FAQ, a timeline of MCP's development, links to the best learning resources, and even technical tips (like automating our Twitter/X bot). Our goal is to welcome you into the MCP community, whether you're a developer or just curious, and help you stay up-to-date with this emerging standard.
            </p>
          </div>
          <div
            id="website-creator"
            className={clsx("faq-entry", {
              highlighted: highlightedEntry === "website-creator",
            })}
          >
            <h3>Who created MCPilled.com?</h3>
            <p>
              This website is a community-driven project created by volunteers who are passionate about MCP. It is not an official Anthropic site, but rather an initiative by members of the MCP community aiming to spread knowledge and encourage participation. The maintainers of MCPilled.com are developers and AI enthusiasts who have been involved with MCP since its early days. We built this site to share our collective insights and make it easier for others to get started with MCP. (If you'd like to contribute content or updates to MCPilled.com, you're welcome – this is a community effort!)
            </p>
          </div>
          <div
            id="how-mcp-works"
            className={clsx("faq-entry", {
              highlighted: highlightedEntry === "how-mcp-works",
            })}
          >
            <h3>How does MCP work?</h3>
            <p>
              MCP works on a simple client–server model for AI context sharing. Here's a high-level view of how it functions:
            </p>
            <ul>
              <li>MCP Servers: These are lightweight programs or connectors that interface with a specific data source or service (for example, a Google Drive MCP server, a Slack MCP server, a GitHub repo server, etc.). Each server exposes certain capabilities (files, search queries, database access, etc.) through the MCP standard.</li>
              <li>MCP Client/Host: This is the AI-powered application (such as Claude Desktop, an IDE with an AI assistant, or any LLM app) that wants to use external data. The host connects to one or more MCP servers using the protocol. Essentially, the AI app "speaks" MCP to ask servers for information or to perform actions.</li>
            </ul>
            <p>
              When connected, the MCP servers advertise what they can do (their available "tools" and data) in a standardized format. The AI client can discover these and invoke them. For example, a Claude AI client could connect to an MCP server for GitHub and then fetch code from a repo or get a file listing via simple MCP commands. All of this happens through a unified protocol interface, so the AI doesn't need custom code for each new tool – it just uses MCP. Communication can be local or over a network, and MCP handles exchanging prompts, function calls, and data results in both directions. In summary, MCP provides a universal "language" for AI and tools to talk to each other, making integration plug-and-play.
            </p>
          </div>
          <div
            id="why-mcp-matters"
            className={clsx("faq-entry", {
              highlighted: highlightedEntry === "why-mcp-matters",
            })}
          >
            <h3>Why does MCP matter?</h3>
            <p>
              MCP is important because it tackles a major pain point in AI integration: connecting AI models to the countless tools and data sources we use, without reinventing the wheel each time. Here are a few key reasons MCP matters:
            </p>
            <ul>
              <li>Standardization: Instead of writing bespoke code for every combination of AI model and data source (the dreaded M×N integration problem), developers and companies can all adhere to one protocol. This standard means any AI that supports MCP can work with any MCP-compliant tool or database, dramatically simplifying development.</li>
              <li>Ecosystem of Integrations: MCP makes it easy to create reusable connectors (servers) for common services. Anthropic jump-started this by open-sourcing reference servers for Google Drive, Slack, Git, GitHub, Postgres, web browsing (Puppeteer), and more. A growing community has since built many more. This "app store" of MCP servers allows you to quickly plug your AI into new capabilities (search, databases, APIs, etc.) without starting from scratch.</li>
              <li>Flexibility and Future-Proofing: Because MCP is model-agnostic, you can swap out or upgrade your AI model without losing connectivity to data. Your context pipeline isn't tied to one vendor. As Anthropic's documentation notes, MCP gives you "the flexibility to switch between LLM providers" while keeping your integrations intact. This encourages innovation and prevents lock-in.</li>
              <li>Better AI Responses: From a user perspective, MCP can lead to more relevant and accurate AI answers. An AI agent that can pull real-time information or query specific knowledge bases via MCP will outperform one that's stuck with only its training data. MCP enables context-aware AI – models that consult up-to-date docs, code, or customer data to ground their responses in facts.</li>
              <li>Security and Control: MCP was designed with security in mind. It allows organizations to keep data access controlled within their infrastructure. For example, you might run an MCP server behind your firewall that exposes a database to the AI with strict permissions. The AI can use the data via MCP, but you don't have to send your database to a third-party service. MCP includes best practices so that connecting an AI doesn't mean opening up unsupervised access.</li>
            </ul>
            <p>
              Overall, MCP represents a shift toward AI systems that are deeply integrated yet modular. By matter of standardizing "how AI connects to any data source," MCP paves the way for more powerful AI assistants in every domain.
            </p>
          </div>
          <div
            id="get-involved"
            className={clsx("faq-entry", {
              highlighted: highlightedEntry === "get-involved",
            })}
          >
            <h3>How can I get involved with MCP?</h3>
            <p>
              One of the great things about MCP is that it's an open, community-driven project from the start. There are several ways you can get involved:
            </p>
            <ul>
              <li>Try it out: If you're technical, a fun way to start is by running a simple MCP server or using one of the examples. For instance, if you use Claude's desktop app, you can enable MCP and connect a sample server (like a file system or Slack connector) to see it in action. The official documentation's Quickstart and Example Servers pages can guide you through this. Seeing an AI query data via MCP in real-time is eye-opening!</li>
              <li>Contribute code: MCP is open source and welcomes contributions. You can find the code on the Model Context Protocol GitHub (which hosts the spec, SDKs in Python/TypeScript/Java/Kotlin, and many reference servers). If you have an idea for a new server (for a tool or API that isn't covered yet) or improvements to the SDKs, jump in! The maintainers explicitly encourage the community to collaborate: "We're committed to building MCP as a collaborative, open-source project… we invite you to build the future of context-aware AI." Even a simple bug fix or doc improvement is helpful. Check out the contributing guidelines in each repo to get started, and feel free to submit pull requests.</li>
              <li>Join the community: You don't have to write code to be part of MCP. There is a growing community of users and developers discussing MCP, sharing ideas, and helping each other. You can join the unofficial MCP Discord server to chat in real-time (find the invite link on the subreddit or GitHub). Speaking of which, the subreddit r/ModelContextProtocol is a place to ask questions, see what others are building, and stay up on the latest community news. Being active in these channels is a great way to contribute – you can ask questions, answer others' questions, or propose ideas. Many community-created tools (like lists of "awesome MCP servers") have come out of these discussions.</li>
              <li>Give feedback: Anthropic and other core MCP developers are eager for user feedback. If you try MCP and encounter issues or have suggestions, you can open an issue on the GitHub or share your thoughts on Discord. Early adopters are helping to shape MCP's direction. For example, if you need a certain feature in the protocol or find something confusing, letting the maintainers know will directly influence future updates. Since MCP is evolving (see the Roadmap on the docs site), your feedback can make a real impact in how the standard grows.</li>
              <li>Spread the word: If you find MCP promising, help others discover it! Write a blog post or tutorial about your experience, showcase a project where you integrated MCP, or simply tell colleagues who might benefit. The more people and companies know about the protocol, the more robust the ecosystem will become.</li>
            </ul>
            <p>
              In short, whether you're a developer, an AI enthusiast, or an end-user with ideas, MCP is open for you to participate. From coding and content creation to community support, all contributions are welcome. This collaborative spirit is how MCP started and how it will continue to thrive.
            </p>
          </div>
          <div
            id="developers-only"
            className={clsx("faq-entry", {
              highlighted: highlightedEntry === "developers-only",
            })}
          >
            <h3>Is MCP only for developers?</h3>
            <p>
              No – even though MCP is a technical protocol, it's not just for software developers. Non-developers can absolutely benefit from MCP, often without realizing it. MCP is meant to power the next generation of AI assistants in everyday tools, so end-users in various roles will see advantages. As one early commentator noted, "everyone in an organization can and should be using MCP – from engineering to sales, marketing to customer success".
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
