// src/api/fetchExportPDF.js
import { message } from 'antd';

export const fetchExportPDF = async (urn) => {
  try {
    const response = await fetch('http://localhost:5000/export_pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urn }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Errore durante l\'esportazione del PDF.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Articolo_${encodeURIComponent(urn)}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    message.success('PDF esportato con successo.');
  } catch (error) {
    console.error('Errore durante l\'esportazione del PDF:', error);
    message.error(error.message);
  }
};
