import axios from 'axios';

/**
 * Generates a career roadmap using our secure serverless backend
 * @param {string} goal - The user's career goal
 */
export async function generateRoadmap(goal) {
  // Now pointing to our internal route in production or dev
  const API_URL = '/api/generate';

  try {
    const response = await axios.post(
      API_URL,
      { goal },
      {
        timeout: 45000, // Slightly longer timeout for serverless overhead
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('API error:', error);
    
    // Improved error handling for the backend response
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`Server error (${status}): ${data?.message || 'Failed to generate roadmap'}`);
    }
    
    if (error.request) {
      throw new Error('Our backend server took too long to respond. Please try again in a moment.');
    }
    
    throw error;
  }
}
