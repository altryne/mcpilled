import Head from "next/head";
import PropTypes from "prop-types";

export default function CustomEntryHead({ title, description, urlPath }) {
  return (
    <Head>
      <title key="title">{title}</title>
      <meta name="description" content={description} key="description" />
      {urlPath && (
        <meta
          property="og:url"
          key="ogurl"
          content={`https://mcpilled.com/${urlPath}`}
        />
      )}
      <meta property="og:title" key="ogtitle" content={title} />
      <meta
        property="og:site_name"
        key="ogsitename"
        content="MCPilled"
      />
      <meta property="og:type" key="ogtype" content="article" />
      <meta
        property="og:description"
        key="ogdescription"
        content={description}
      />
      <meta name="twitter:title" key="twittertitle" content={title} />
      <meta
        name="twitter:description"
        key="twitterdescription"
        content={description}
      />
    </Head>
  );
}

CustomEntryHead.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  urlPath: PropTypes.string.isRequired,
};
