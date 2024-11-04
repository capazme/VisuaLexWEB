// src/App.js
import React, { useState } from 'react';
import { Layout, Typography, message } from 'antd';
import NormList from './components/NormList/NormList';
import FloatingSearchButton from './components/SearchForm/FloatingSearchButton';
import { fetchAllData } from './api/fetchAllData';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [results, setResults] = useState([]);

  const handleSearch = async (data) => {
    try {
      const result = await fetchAllData(data);
      if (!result.error) {
        setResults(result);
        message.success('Ricerca completata con successo!');
      } else {
        console.error(result.error);
        message.error('Errore durante la ricerca.');
      }
    } catch (error) {
      console.error('Errore durante la ricerca:', error);
      message.error('Errore durante la ricerca.');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#fff', padding: '1em' }}>
        <Title level={3} style={{ margin: 0 }}>
          VisuaLex - Ricerca Norme
        </Title>
      </Header>
      <Content style={{ padding: '2em' }}>
        <NormList data={results} />
      </Content>

      {/* Pulsante fluttuante per la ricerca */}
      <FloatingSearchButton onSearch={handleSearch} />
    </Layout>
  );
};

export default App;
