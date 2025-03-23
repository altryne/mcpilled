import Head from "next/head";
import PropTypes from "prop-types";
import ReactGA from "react-ga";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "../components/Layout";
import { AppProvider } from "../context/AppContext";
import "../styles/main.sass";

if (typeof window !== "undefined") {
  ReactGA.initialize("TODO REPLACE WITH GOOGLA ADS");
  history.scrollRestoration = "manual";
}

function CustomApp({ Component, pageProps }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <>
      <Head>
        <title key="title">MCPilled</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          key="description"
          content="MCPilled.com is a collection of curated news about MCP servers, clients, protocol updates and everything else MCP"
        />
        <meta name="author" content="Alex Volkov" />
        <meta name="msapplication-TileColor" content="#603cba" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#5948a4" />
        <meta
          property="og:url"
          key="ogurl"
          content="https://mcpilled.com/"
        />
        <meta
          property="og:title"
          key="ogtitle"
          content="MCPilled"
        />
        <meta property="og:type" key="ogtype" content="website" />
        <meta
          property="og:description"
          key="ogdescription"
          content="MCPilled.com is a collection of curated news about MCP servers, clients, protocol updates and everything else MCP"
        />
        <meta
          property="og:image"
          key="ogimage"
          content="https://primary-cdn.mcpilled.com/og.png"
        />
        <meta
          property="og:image:alt"
          key="ogimagealt"
          content="Illustration: A sad-looking Bored Ape Yacht Club NFT monkey looks at a world engulfed in flames. Text next to it says 'MCPilled.'"
        />
        <meta property="og:image:width" key="ogwidth" content="1200" />
        <meta property="og:image:height" key="ogheight" content="630" />
        <meta
          name="twitter:card"
          key="twittercard"
          content="summary_large_image"
        />
        <meta name="twitter:creator" content="@altryne" />
        <meta name="twitter:creator:id" content="545445165" />
        <meta name="twitter:site" content="@mcpilled" />
        <meta name="twitter:site:id" content="1477342011875381251" />
        <meta
          name="twitter:title"
          key="twittertitle"
          content="MCPilled"
        />
        <meta
          name="twitter:description"
          key="twitterdescription"
          content="MCPilled.com is a collection of curated news about MCP servers, clients, protocol updates and everything else MCP"
        />
        <meta
          name="twitter:image"
          key="twitterimage"
          content="https://primary-cdn.mcpilled.com/monkey-twitter.png"
        />
        <meta
          name="twitter:image:alt"
          key="twitterimagealt"
          content="MCPilled"
        />
        
      </Head>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </QueryClientProvider>
    </>
  );
}

CustomApp.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object,
};

export default CustomApp;
