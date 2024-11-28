import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import FloatingSearchBall from './components/SearchForm/FloatingSearchBall';
import NormList from './components/NormList/NormList';
import { fetchAllData } from './api/fetchAllData';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [results, setResults] = useState({});

  const handleSearch = async (data) => {
    try {
      const newResults = await fetchAllData(data);
      setResults(newResults);
    } catch (error) {
      console.error('Errore durante la ricerca:', error);
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
        <FloatingSearchBall onSearch={handleSearch} />
        <NormList data={Object.values(results)} />
      </Content>
    </Layout>
  );
};

export default App;
