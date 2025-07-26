// frontend/src/services/unitService.js
const API_URL = 'http://localhost:5000/api/units'; // Ensure this matches your backend port

export const submitUnits = async (units) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(units),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit units');
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting units:', error);
    throw error;
  }
};

export const getUnits = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch units');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching units:', error);
    throw error;
  }
};
