// src/api/fetchAllData.js
import axios from 'axios';

export const fetchAllData = async (data) => {
  try {
    const response = await axios.post('http://localhost:5000/fetch_all_data', data);
    return response.data;
  } catch (error) {
    console.error("Errore nella richiesta:", error);
    return { error: error.message };
  }
};
