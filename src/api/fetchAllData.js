// src/api/fetchAllData.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const fetchAllData = async (data) => {
  console.log('Inizio della richiesta per fetchAllData con i seguenti dati:', data);
  try {
    const response = await axios.post(`${API_BASE_URL}/fetch_all_data`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Richiesta fetchAllData completata con successo. Dati ricevuti:', response.data);
    return response.data;
  } catch (error) {
    console.error('Errore nella richiesta fetchAllData:', error);
    if (error.response) {
      // Il server ha risposto con un codice di stato fuori dal range 2xx
      return { error: error.response.data.message || 'Errore del server.' };
    } else if (error.request) {
      // La richiesta è stata fatta ma nessuna risposta ricevuta
      return { error: 'Nessuna risposta dal server.' };
    } else {
      // Qualcosa è andato storto nell'impostare la richiesta
      return { error: error.message };
    }
  }
};
