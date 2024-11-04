// src/App.js
import React, { useState } from 'react';
import { Layout, Typography, message, Button } from 'antd';
import { Rnd } from 'react-rnd';
import SearchForm from './components/SearchForm/SearchForm';
import NormList from './components/NormList/NormList';
import { fetchAllData } from './api/fetchAllData';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [results, setResults] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

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
      console.error(error);
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

      {/* Bottone per mostrare la scheda */}
      <Button
        type="primary"
        onClick={() => setIsVisible(!isVisible)}
        style={{ position: 'fixed', top: '1em', right: '1em', zIndex: 1000 }}
      >
        Cerca Norme
      </Button>

      {/* Scheda fluttuante */}
      {isVisible && (
        <Rnd
          default={{
            x: 100,
            y: 100,
            width: 400,
            height: 500,
          }}
          minWidth={300}
          minHeight={400}
          bounds="window"
          style={{
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            padding: '16px',
            zIndex: 1500,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5} style={{ margin: 0 }}>
              Ricerca Norme
            </Title>
            <Button type="text" onClick={() => setIsVisible(false)}>
              Chiudi
            </Button>
          </div>
          <SearchForm onSearch={handleSearch} />
        </Rnd>
      )}
    </Layout>
  );
};

export default App;
