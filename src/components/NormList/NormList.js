// src/components/NormList/NormList.js
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const NormList = ({ data }) => {
  return (
    <Box sx={{ mt: 3 }}>
      {data.map((item, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Articolo: {item.norma_data.numero_articolo}</Typography>
            <Typography variant="body2">Testo: {item.article_text || 'Non disponibile'}</Typography>
            {item.brocardi_info && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Informazioni Brocardi</Typography>
                <Typography variant="body2">Ratio: {item.brocardi_info.Ratio || 'N/A'}</Typography>
                {/* Aggiungi ulteriori dettagli Brocardi se presenti */}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default NormList;
