import React from "react";
import useGA from "../hooks/useGA";

import CustomHead from "../components/CustomHead";
import Footer from "../components/Footer";
import Header from "../components/timeline/Header";
import ExternalLink from "../components/ExternalLink";

export default function OverviewPage() {
  useGA();

  return (
    <>
      <CustomHead
        title="MCP Overview - MCPilled"
        description="Learn about the Model Context Protocol (MCP) - the open standard that lets AI assistants connect to external data sources and tools in a unified way."
        urlPath="overview"
      />
      <Header />
      <main className="content-wrapper">
        <section className="hero-section">
          <h1>Model Context Protocol (MCP) Overview</h1>
          <h2>Your Guide to the Model Context Protocol</h2>
          
          <p className="hero-description">
            Model Context Protocol (MCP) is an open standard created by Anthropic that lets AI assistants connect to external data sources and tools in a unified way. Think of MCP like a "USB-C port for AI applications" – instead of custom integrations for every data source, MCP provides one standardized interface.
          </p>
          
          <div className="cta-buttons">
            <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/tree/main/mcp" className="button primary">
              <span>Get Started with MCP</span>
            </ExternalLink>
            <ExternalLink href="https://discord.gg/mcpilled" className="button secondary">
              <span>Join the Community</span>
            </ExternalLink>
          </div>
        </section>
        
        <section className="features-section">
          <h2>Why Use MCP?</h2>
          
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Standardized Integration</h3>
              <p>Connect AI models to any data source or tool using one unified protocol, eliminating the need for custom integrations.</p>
            </div>
            
            <div className="feature-card">
              <h3>Ecosystem of Connectors</h3>
              <p>Leverage a growing library of reusable MCP servers for common services like GitHub, Google Drive, databases, and more.</p>
            </div>
            
            <div className="feature-card">
              <h3>Model Flexibility</h3>
              <p>Swap AI models without losing data connections. MCP works with any AI system that implements the protocol.</p>
            </div>
            
            <div className="feature-card">
              <h3>Better AI Responses</h3>
              <p>Give AI assistants access to up-to-date, relevant information from your systems to provide more accurate and helpful responses.</p>
            </div>
            
            <div className="feature-card">
              <h3>Security & Control</h3>
              <p>Keep data access controlled within your infrastructure. MCP servers enforce permissions and access controls.</p>
            </div>
            
            <div className="feature-card">
              <h3>Open Standard</h3>
              <p>MCP is an open standard, encouraging community contributions and ensuring compatibility across the AI ecosystem.</p>
            </div>
          </div>
        </section>
        
        <section className="getting-started-section">
          <h2>Getting Started with MCP</h2>
          
          <div className="steps">
            <div className="step">
              <h3>1. Learn the Basics</h3>
              <p>
                Start by understanding <a href="/what">what MCP is</a> and how it works. Check out the <a href="/glossary">glossary</a> for key terms and concepts.
              </p>
            </div>
            
            <div className="step">
              <h3>2. Explore Examples</h3>
              <p>
                Browse through <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/tree/main/mcp/example_servers"><span>example MCP servers</span></ExternalLink> to see how MCP can be used in different scenarios.
              </p>
            </div>
            
            <div className="step">
              <h3>3. Build Your First MCP Server</h3>
              <p>
                Follow the <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/blob/main/mcp/quickstart.ipynb"><span>quickstart guide</span></ExternalLink> to create your first MCP server and connect it to an AI assistant.
              </p>
            </div>
            
            <div className="step">
              <h3>4. Join the Community</h3>
              <p>
                Connect with other MCP enthusiasts on <ExternalLink href="https://discord.gg/mcpilled"><span>Discord</span></ExternalLink> and <ExternalLink href="https://twitter.com/mcpilled"><span>Twitter</span></ExternalLink> to share your projects and get help.
              </p>
            </div>
          </div>
        </section>
        
        <section className="resources-section">
          <h2>Resources</h2>
          
          <div className="resource-links">
            <ExternalLink href="https://docs.anthropic.com/claude/docs/model-context-protocol" className="resource-link">
              <span>Official MCP Documentation</span>
            </ExternalLink>
            
            <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/tree/main/mcp" className="resource-link">
              <span>Anthropic MCP Cookbook</span>
            </ExternalLink>
            
            <ExternalLink href="https://github.com/anthropics/anthropic-cookbook/blob/main/mcp/quickstart.ipynb" className="resource-link">
              <span>MCP Quickstart Guide</span>
            </ExternalLink>
            
            <a href="/contribute" className="resource-link">
              Contribute to MCPilled
            </a>
            
            <a href="/faq" className="resource-link">
              Frequently Asked Questions
            </a>
          </div>
        </section>
      </main>
      <Footer />
      
      <style jsx>{`
        .hero-section {
          text-align: center;
          padding: 3rem 1rem;
          margin-bottom: 2rem;
        }
        
        .hero-section h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .hero-section h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          font-weight: normal;
          color: #666;
        }
        
        .hero-description {
          max-width: 800px;
          margin: 0 auto 2rem;
          font-size: 1.2rem;
          line-height: 1.6;
        }
        
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .button {
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-weight: bold;
          text-decoration: none;
          display: inline-block;
        }
        
        .button.primary {
          background-color: #5948a4;
          color: white;
        }
        
        .button.secondary {
          background-color: #f0f0f0;
          color: #333;
        }
        
        .features-section,
        .getting-started-section,
        .resources-section {
          margin-bottom: 3rem;
          padding: 0 1rem;
        }
        
        .features-section h2,
        .getting-started-section h2,
        .resources-section h2 {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .feature-card {
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .feature-card h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #5948a4;
        }
        
        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .step {
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .step h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #5948a4;
        }
        
        .resource-links {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .resource-link {
          display: block;
          padding: 1rem;
          background-color: #f9f9f9;
          border-radius: 8px;
          text-decoration: none;
          color: #5948a4;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }
        
        .resource-link:hover {
          background-color: #5948a4;
          color: white;
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2rem;
          }
          
          .hero-section h2 {
            font-size: 1.2rem;
          }
          
          .hero-description {
            font-size: 1rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}
