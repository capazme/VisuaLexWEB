// src/App.js
import React, { useState } from 'react';
import { Layout, Typography, message } from 'antd';
import FloatingSearchBall from './components/SearchForm/FloatingSearchBall';
import NormList from './components/NormList/NormList';
import ArticleDetail from './components/ArticleDetail/ArticleDetail';
import { fetchAllData } from './api/fetchAllData';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [results, setResults] = useState([]); // Inizializza come array
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const handleSearch = async (data) => {
    try {
      const fetchedData = await fetchAllData(data);
      if (!fetchedData || fetchedData.error) {
        console.error(fetchedData?.error || 'Errore sconosciuto');
        message.error(fetchedData?.error || 'Errore sconosciuto durante la ricerca.');
        return;
      }

      // Raggruppa gli articoli per norma
      const groupedData = fetchedData.reduce((acc, item) => {
        const { tipo_atto, numero_atto, data } = item.norma_data;
        const key = `${tipo_atto}-${numero_atto}-${data}`;
        if (!acc.some(norm => norm.key === key)) { // Evita duplicati
          acc.push({
            key, // Aggiungi una chiave unica
            info: {
              tipo_atto,
              numero_atto,
              data,
            },
            articles: [],
          });
        }
        const normIndex = acc.findIndex(norm => norm.key === key);
        acc[normIndex].articles.push(item);
        return acc;
      }, []);

      setResults(prevResults => [...prevResults, ...groupedData]); // Appendere i nuovi risultati
      message.success('Ricerca completata con successo.');
    } catch (error) {
      console.error('Errore durante la ricerca:', error);
      message.error('Errore durante la ricerca. Riprova più tardi.');
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleCloseArticleModal = () => {
    setIsArticleModalOpen(false);
    setSelectedArticle(null);
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
        <NormList data={results} onArticleClick={handleArticleClick} /> {/* Passa l'array completo */}
        {selectedArticle && (
          <ArticleDetail
            open={isArticleModalOpen}
            article={selectedArticle}
            onClose={handleCloseArticleModal}
          />
        )}
      </Content>
    </Layout>
  );
};

export default App;
