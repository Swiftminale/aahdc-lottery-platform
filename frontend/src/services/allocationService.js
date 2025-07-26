// frontend/src/services/allocationService.js
// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/allocation`; // Adjust this specific endpoint for each service file


export const runAllocation = async (method) => {
  try {
    const response = await fetch(`${API_URL}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ distributionMethod: method }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to run allocation');
    }
    return await response.json();
  } catch (error) {
    console.error('Error running allocation:', error);
    throw error;
  }
};

export const getAllocatedUnits = async () => {
    try {
      const response = await fetch(`${API_URL}/allocated`);
      if (!response.ok) {
        throw new Error('Failed to fetch allocated units');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching allocated units:', error);
      throw error;
    }
};

export const getUnallocatedUnits = async () => {
    try {
      const response = await fetch(`${API_URL}/unallocated`);
      if (!response.ok) {
        throw new Error('Failed to fetch unallocated units');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching unallocated units:', error);
      throw error;
    }
};
