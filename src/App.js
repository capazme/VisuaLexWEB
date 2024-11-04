// src/App.js
import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import SearchForm from './components/SearchForm/SearchForm';
import NormList from './components/NormList/NormList';
import { fetchAllData } from './api/fetchAllData';

function App() {
  const [results, setResults] = useState([]);

  const handleSearch = async (data) => {
    const result = await fetchAllData(data);
    if (!result.error) {
      setResults(result);
    } else {
      console.error(result.error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <SearchForm onSearch={handleSearch} />
        <NormList data={results} />
      </div>
    </ThemeProvider>
  );
}

export default App;
