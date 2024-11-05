import React, { useState } from 'react';
import { Layout, Typography, message } from 'antd';
import NormList from './components/NormList/NormList';
import FloatingSearchButton from './components/SearchForm/FloatingSearchButton';
import { fetchAllData } from './api/fetchAllData';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [results, setResults] = useState({});

  const handleSearch = async (data) => {
    try {
      const newResults = await fetchAllData(data);
      
      if (!newResults || newResults.error) {
        console.error(newResults?.error || "Errore sconosciuto");
        return message.error('Errore durante la ricerca.');
      }

      // Crea una copia dell'oggetto results per evitare mutazioni dirette
      const updatedResults = { ...results };

      if (Array.isArray(newResults)) {
        newResults.forEach((doc) => {
          const { tipo_atto, data: dataNorma, numero_atto } = doc.norma_data || {};

          if (tipo_atto && dataNorma !== undefined) {
            const uniqueKey = `${tipo_atto}-${dataNorma || 'null'}-${numero_atto || 'null'}`;

            // Verifica se l'articolo esiste già nella norma
            if (updatedResults[uniqueKey]) {
              const articleExists = updatedResults[uniqueKey].articles.some(
                (article) => article.norma_data.numero_articolo === doc.norma_data.numero_articolo
              );

              if (!articleExists) {
                updatedResults[uniqueKey].articles.push(doc);
              }
            } else {
              // Aggiungi nuova norma con l'articolo iniziale
              updatedResults[uniqueKey] = {
                info: doc.norma_data,
                articles: [doc],
              };
            }
          } else {
            console.warn("Documento senza 'norma_data' o campi mancanti:", doc);
          }
        });
      }

      setResults(updatedResults);
      message.success('Ricerca completata con successo!');
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
        <NormList data={Object.values(results)} />
      </Content>
      <FloatingSearchButton onSearch={handleSearch} />
    </Layout>
  );
};

export default App;
