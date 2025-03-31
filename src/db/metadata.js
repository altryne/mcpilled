// Replaced Firebase implementation with mock function
// since Firebase is no longer needed

export const getMetadata = async () => {
  // Return mock metadata with empty collections
  return {
    collections: {}
  };
};
