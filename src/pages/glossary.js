import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useGA from "../hooks/useGA";

import CustomHead from "../components/CustomHead";
import BackBar from "../components/BackBar";
import Footer from "../components/Footer";
import SimpleHeader from "../components/SimpleHeader";

export default function Glossary() {
  useGA();

  const [highlightedEntry, setHighlightedEntry] = useState();
  useEffect(() => {
    if (window.location.hash) {
      setHighlightedEntry(window.location.hash.slice(1));
    }
  }, [setHighlightedEntry]);

  const glossaryEntries = [
    {
      id: "mcp",
      term: "MCP (Model Context Protocol)",
      definition: "An open standard created by Anthropic that lets AI assistants connect to external data sources and tools in a unified way. MCP provides a standardized interface for AI models to access and interact with various data sources and services."
    },
    {
      id: "mcp-server",
      term: "MCP Server",
      definition: "A lightweight program or connector that interfaces with a specific data source or service (e.g., Google Drive, GitHub, database) and exposes its capabilities through the MCP standard. MCP servers advertise what they can do (their available 'tools' and data) in a standardized format."
    },
    {
      id: "mcp-client",
      term: "MCP Client/Host",
      definition: "An AI-powered application (such as Claude Desktop, an IDE with an AI assistant, or any LLM app) that wants to use external data. The host connects to one or more MCP servers using the protocol. Essentially, the AI app 'speaks' MCP to ask servers for information or to perform actions."
    },
    {
      id: "mcp-tool",
      term: "MCP Tool",
      definition: "A capability exposed by an MCP server that an AI client can use. Tools can include file operations, search capabilities, database queries, API calls, and more. Each tool has a defined schema that describes its inputs and outputs."
    },
    {
      id: "llm",
      term: "LLM (Large Language Model)",
      definition: "A type of AI model trained on vast amounts of text data that can generate human-like text, answer questions, and perform various language-related tasks. Examples include Anthropic's Claude, OpenAI's GPT models, and Google's Gemini."
    },
    {
      id: "rag",
      term: "RAG (Retrieval-Augmented Generation)",
      definition: "A technique that enhances LLM outputs by first retrieving relevant information from external sources and then using that information to generate more accurate and informed responses. MCP can be used to implement RAG by connecting LLMs to various data sources."
    },
    {
      id: "anthropic",
      term: "Anthropic",
      definition: "The AI safety company that created Claude and developed the Model Context Protocol (MCP). Anthropic focuses on building reliable, interpretable, and steerable AI systems."
    },
    {
      id: "claude",
      term: "Claude",
      definition: "Anthropic's family of AI assistants, designed to be helpful, harmless, and honest. Claude can use MCP to connect to external data sources and tools."
    },
    {
      id: "context-window",
      term: "Context Window",
      definition: "The amount of text an AI model can consider at once when generating a response. MCP helps overcome context window limitations by allowing models to dynamically access information from external sources as needed."
    },
    {
      id: "agentic-ai",
      term: "Agentic AI",
      definition: "AI systems that can act more autonomously to accomplish tasks, often by using tools and making decisions about what actions to take. MCP enables more agentic capabilities by giving AI models standardized access to various tools and data sources."
    }
  ];

  return (
    <>
      <CustomHead
        title="MCP Glossary – MCPilled"
        description="Glossary of common terms related to the Model Context Protocol (MCP) and AI assistants"
        urlPath="glossary"
      />
      <SimpleHeader>MCP Glossary</SimpleHeader>
      <BackBar />
      <div className="content-wrapper">
        <article className="generic-page longform-text">
          <p>
            This glossary provides definitions for common terms related to the Model Context Protocol (MCP) and AI assistants. Use it as a reference when exploring MCP concepts and implementations.
          </p>
          <dl>
            {glossaryEntries.map((entry) => (
              <div
                key={entry.id}
                className={
                  "glossary-entry" +
                  (entry.id === highlightedEntry ? " highlighted" : "")
                }
              >
                <dt id={entry.id}>{entry.term}</dt>
                <dd>
                  <span
                    dangerouslySetInnerHTML={{ __html: entry.definition }}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
      <Footer />
    </>
  );
}

Glossary.propTypes = {
  glossary: PropTypes.shape({
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        term: PropTypes.string.isRequired,
        definition: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
};
