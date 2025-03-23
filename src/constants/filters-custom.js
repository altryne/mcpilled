import PropTypes from "prop-types";

const FILTERS = {
  theme: {
    analysis: "Analysis",
    news: "News",
    tutorial: "Tutorial",
    review: "Review",
    opinion: "Opinion",
    controversy: "Controversy",
    research: "Research",
    interview: "Interview",
    casestudy: "Case Study",
    guide: "Guide",
    announcement: "Announcement",
  },
  tech: {
    ai: "AI",
    blockchain: "Blockchain",
    web3: "Web3",
    crypto: "Cryptocurrency",
    ml: "Machine Learning",
    llm: "Large Language Models",
    agentai: "Agent AI",
    multimodal: "Multimodal AI",
    neuralnetworks: "Neural Networks",
    nlp: "NLP",
    computerVision: "Computer Vision",
  },
  platform: {
    openai: "OpenAI",
    anthropic: "Anthropic",
    google: "Google",
    meta: "Meta AI",
    microsoft: "Microsoft",
    stability: "Stability AI",
    midjourney: "Midjourney",
    huggingface: "Hugging Face",
    mistral: "Mistral AI",
    cohere: "Cohere",
    nvidia: "NVIDIA",
    perplexity: "Perplexity",
  },
};

export const EMPTY_FILTERS_STATE = {
  theme: [],
  tech: [],
  platform: [],
  sort: "Descending",
};

export const FILTER_CATEGORIES = ["theme", "tech", "platform"];

const ThemePropType = PropTypes.oneOf(Object.keys(FILTERS.theme));
const TechPropType = PropTypes.oneOf(Object.keys(FILTERS.tech));
const PlatformPropType = PropTypes.oneOf(Object.keys(FILTERS.platform));

export const FiltersPropType = PropTypes.shape({
  theme: PropTypes.arrayOf(ThemePropType).isRequired,
  tech: PropTypes.arrayOf(TechPropType).isRequired,
  platform: PropTypes.arrayOf(PlatformPropType).isRequired,
  sort: PropTypes.oneOf(["Descending", "Ascending"]).isRequired,
});

export default FILTERS;
