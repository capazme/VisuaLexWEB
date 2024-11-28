// src/api/fetchTree.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/**
 * Funzione per chiamare l'endpoint fetch_tree.
 * @param {string} urn - L'URN della norma.
 * @param {boolean} link - Flag per ottenere i link.
 * @param {boolean} details - Flag per ottenere i dettagli delle sezioni.
 * @returns {Promise<object>} - Dati della legenda e conteggio.
 */
export const fetchTree = async (urn, link = false, details = false) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fetch_tree`, {
      urn,
      link,
      details,
    });
    return response.data;
  } catch (error) {
    console.error('Errore durante la chiamata a fetch_tree:', error);
    throw error.response?.data?.error || 'Errore durante la chiamata a fetch_tree.';
  }
};
