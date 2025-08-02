// frontend/src/services/reportService.js
// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/reports`; // Adjust this specific endpoint for each service file


export const downloadExcelReport = async () => {
  try {
    const response = await fetch(`${API_URL}/excel`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to download Excel report');
    }
    // Create a Blob from the response and trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'allocation_report.xlsx');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Error downloading Excel report:', error);
    throw error;
  }
};

export const downloadPdfReport = async () => {
  try {
    const response = await fetch(`${API_URL}/pdf`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download PDF report');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'allocation_report.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Error downloading PDF report:', error);
    throw error;
  }
};
