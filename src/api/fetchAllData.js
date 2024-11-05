// src/api/fetchAllData.js
import axios from 'axios';

export const fetchAllData = async (data) => {
  console.log('Inizio della richiesta per fetchAllData con i seguenti dati:', data);
  try {
    const response = await axios.post('http://localhost:5000/fetch_all_data', data);
    console.log('Richiesta fetchAllData completata con successo. Dati ricevuti:', response.data);
    return response.data;
  } catch (error) {
    console.error('Errore nella richiesta fetchAllData:', error);
    return { error: error.message };
  }
};
