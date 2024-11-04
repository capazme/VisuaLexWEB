// src/components/SearchForm/SearchForm.js
import React, { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, RadioGroup, Radio, FormControlLabel, FormLabel } from '@mui/material';

const SearchForm = ({ onSearch }) => {
  const [actType, setActType] = useState('');
  const [actNumber, setActNumber] = useState('');
  const [date, setDate] = useState('');
  const [article, setArticle] = useState('');
  const [version, setVersion] = useState('originale');
  const [versionDate, setVersionDate] = useState('');
  const [annex, setAnnex] = useState('');

  // Tipi di atti per cui Numero Atto e Data Atto sono rilevanti
  const requiresActDetails = ['legge', 'decreto legge', 'decreto legislativo', 'regolamento ue', 'direttiva ue'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      act_type: actType,
      act_number: actType && requiresActDetails.includes(actType) ? actNumber : undefined,
      date: date || undefined,
      article,
      version,
      version_date: version === 'vigente' ? versionDate : undefined,
      annex: annex || undefined,
    };
    onSearch(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Tipo Atto */}
      <FormControl fullWidth>
        <InputLabel>Tipo Atto</InputLabel>
        <Select value={actType} onChange={(e) => setActType(e.target.value)} label="Tipo Atto">
          <MenuItem value="legge">Legge</MenuItem>
          <MenuItem value="costituzione">Costituzione</MenuItem>
          <MenuItem value="codice di procedura penale">Codice di Procedura Penale</MenuItem>
          <MenuItem value="cdfue">CDFUE</MenuItem>
        </Select>
      </FormControl>

      {/* Numero Atto (solo se Tipo Atto è tra quelli specificati) */}
      {requiresActDetails.includes(actType) && (
        <TextField label="Numero Atto" value={actNumber} onChange={(e) => setActNumber(e.target.value)} />
      )}

      {/* Data Atto (accetta solo anno o data completa) */}
      {requiresActDetails.includes(actType) && (
        <TextField
          label="Data Atto"
          placeholder="aaaa o gg/mm/aaaa"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      )}

      {/* Articolo */}
      <TextField
        label="Articolo"
        placeholder="Es. 1, 3-5"
        value={article}
        onChange={(e) => setArticle(e.target.value)}
        helperText="Inserisci un numero, una lista o un intervallo di articoli"
      />

      {/* Versione */}
      <FormControl component="fieldset">
        <FormLabel component="legend">Versione</FormLabel>
        <RadioGroup
          row
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        >
          <FormControlLabel value="originale" control={<Radio />} label="Originale" />
          <FormControlLabel value="vigente" control={<Radio />} label="Vigente" />
        </RadioGroup>
      </FormControl>

      {/* Data Versione (solo se Versione è "vigente") */}
      {version === 'vigente' && (
        <TextField
          label="Data Versione"
          type="date"
          value={versionDate}
          onChange={(e) => setVersionDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      )}

      {/* Annex (campo nascosto, mostrato solo al bisogno) */}
      {false && (
        <TextField
          label="Annex"
          value={annex}
          onChange={(e) => setAnnex(e.target.value)}
        />
      )}

      {/* Submit Button */}
      <Button variant="contained" type="submit">Cerca</Button>
    </Box>
  );
};

export default SearchForm;
