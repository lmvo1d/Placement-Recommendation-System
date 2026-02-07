import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getRecommendations = async (companyData) => {
  try {
    const response = await axios.post(`${API_URL}/recommend`, companyData);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};