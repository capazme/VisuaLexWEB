// src/components/SearchForm/SearchForm.js
import React, { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const SearchForm = ({ onSearch }) => {
  const [actType, setActType] = useState('');
  const [date, setDate] = useState('');
  const [actNumber, setActNumber] = useState('');
  const [article, setArticle] = useState('');
  const [version, setVersion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { act_type: actType, date, act_number: actNumber, article, version };
    onSearch(data); // Invio dei dati al backend
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Tipo Atto</InputLabel>
        <Select value={actType} onChange={(e) => setActType(e.target.value)} label="Tipo Atto">
          <MenuItem value="legge">Legge</MenuItem>
          <MenuItem value="decreto legge">Decreto Legge</MenuItem>
          {/* Aggiungi altre opzioni... */}
        </Select>
      </FormControl>
      <TextField label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
      <TextField label="Numero Atto" value={actNumber} onChange={(e) => setActNumber(e.target.value)} />
      <TextField label="Articolo" value={article} onChange={(e) => setArticle(e.target.value)} />
      <TextField label="Versione" value={version} onChange={(e) => setVersion(e.target.value)} />
      <Button variant="contained" type="submit">Cerca</Button>
    </Box>
  );
};

export default SearchForm;
