/**
 * Search entries using our hybrid search API (text + vector similarity)
 * This implementation keeps the OpenAI API key secure on the server
 */

/**
 * Search for entries using the hybrid search API
 * @param {string} query - The search query
 * @param {Object} filters - The filters to apply
 * @param {string} mode - The search mode (hybrid, vector, text)
 * @returns {Promise<Object>} - The search results
 */
export async function search(query, filters, mode = 'hybrid') {
  try {
    // Build the query parameters
    const params = new URLSearchParams();
    params.append('query', query);
    
    // Add filters if they exist
    if (filters) {
      if (filters.theme && filters.theme.length > 0) {
        params.append('filters.theme', filters.theme.join(','));
      }
      
      if (filters.category && filters.category.length > 0) {
        params.append('filters.category', filters.category.join(','));
      }
      
      if (filters.server && filters.server.length > 0) {
        params.append('filters.server', filters.server.join(','));
      }
    }
    
    // Add search mode
    params.append('mode', mode);
    
    // Make the API request
    const response = await fetch(`/api/search/hybrid?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching entries:', error);
    return { hits: [] };
  }
}
