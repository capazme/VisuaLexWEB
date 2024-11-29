// src/components/NormList/NormList.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd'; // Ensure proper DragDropContext
import NormCard from './NormCard/NormCard';
import ArticleDetail from '../ArticleDetail/ArticleDetail';
import { Typography, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import './NormList.styles.css';

const { Text } = Typography;

const NormList = ({ data }) => {
  const [articlesData, setArticlesData] = useState({});
  const [pinnedArticles, setPinnedArticles] = useState([]);
  const [openArticles, setOpenArticles] = useState([]);
  const [zIndexMap, setZIndexMap] = useState({});
  const [highestZIndex, setHighestZIndex] = useState(1000);

  // Load pinned articles and z-index map from localStorage
  useEffect(() => {
    const storedPinned = localStorage.getItem('pinnedArticles');
    const storedZIndexMap = localStorage.getItem('zIndexMap');
    if (storedPinned) setPinnedArticles(JSON.parse(storedPinned));
    if (storedZIndexMap) setZIndexMap(JSON.parse(storedZIndexMap));
  }, []);

  // Save pinned articles and z-index map to localStorage
  useEffect(() => {
    localStorage.setItem('pinnedArticles', JSON.stringify(pinnedArticles));
    localStorage.setItem('zIndexMap', JSON.stringify(zIndexMap));
  }, [pinnedArticles, zIndexMap]);

  // Group articles by norm
  useEffect(() => {
    const groupedArticles = {};

    data.forEach((norm) => {
      const { tipo_atto, numero_atto, data: normDate } = norm.info;
      const normKey = `${tipo_atto || 'Norma'}-${numero_atto || 'NoNumber'}-${normDate || 'NoDate'}`;

      if (!groupedArticles[normKey]) {
        groupedArticles[normKey] = {
          normInfo: norm.info,
          articles: [],
        };
      }

      const articlesWithIds = norm.articles.map((article) => ({
        ...article,
        id: article.id || uuidv4(),
        normKey,
        normInfo: norm.info,
      }));

      groupedArticles[normKey].articles = [
        ...articlesWithIds.filter((article) => pinnedArticles.includes(article.id)),
        ...articlesWithIds.filter((article) => !pinnedArticles.includes(article.id)),
      ];
    });

    setArticlesData(groupedArticles);
  }, [data, pinnedArticles]);

  // Bring NormCard to the front by updating its z-index
  const updateZIndex = (normKey) => {
    setHighestZIndex((prev) => prev + 1);
    setZIndexMap((prev) => ({
      ...prev,
      [normKey]: highestZIndex + 1,
    }));
  };

  // Handle deleting a norm
  const handleDeleteNorm = (normKey) => {
    const updatedData = { ...articlesData };
    delete updatedData[normKey];
    setArticlesData(updatedData);

    const updatedZIndexMap = { ...zIndexMap };
    delete updatedZIndexMap[normKey];
    setZIndexMap(updatedZIndexMap);

    message.success('Norma eliminata con successo.');
  };

  // Handle open and close article details
  const handleOpenArticle = (article) => {
    setOpenArticles((prev) => [...prev, article]);
  };

  const handleCloseArticle = (articleId) => {
    setOpenArticles((prev) => prev.filter((a) => a.id !== articleId));
  };

  // Handle drag and drop (you can customize this logic as needed)
  const onDragEnd = () => {
    // Placeholder function for future drag-and-drop interactions
  };

  if (!Object.keys(articlesData).length) {
    return <Text type="secondary">Nessun risultato da visualizzare.</Text>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {Object.entries(articlesData).map(([normKey, normGroup]) => (
        <NormCard
          key={normKey}
          normKey={normKey}
          normGroup={normGroup}
          pinnedArticles={pinnedArticles}
          onOpenArticle={handleOpenArticle}
          setPinnedArticles={setPinnedArticles}
          position={zIndexMap[normKey]}
          onUpdatePosition={(normKey, position) =>
            setZIndexMap((prev) => ({ ...prev, [normKey]: position }))
          }
          highestZIndex={highestZIndex}
          setHighestZIndex={setHighestZIndex}
          currentZIndex={zIndexMap[normKey] || 0}
          updateZIndex={updateZIndex}
          onDeleteNorm={handleDeleteNorm}
        />
      ))}

      {openArticles.map((article) => (
        <ArticleDetail
          key={article.id}
          article={article}
          onClose={() => handleCloseArticle(article.id)}
        />
      ))}
    </DragDropContext>
  );
};

NormList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      info: PropTypes.shape({
        tipo_atto: PropTypes.string.isRequired,
        numero_atto: PropTypes.string,
        data: PropTypes.string,
      }).isRequired,
      articles: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          norma_data: PropTypes.shape({
            numero_articolo: PropTypes.string.isRequired,
            versione: PropTypes.string,
            data_versione: PropTypes.string,
            allegato: PropTypes.string,
          }).isRequired,
          article_text: PropTypes.string,
          brocardi_info: PropTypes.shape({
            Spiegazione: PropTypes.string,
            Massime: PropTypes.arrayOf(PropTypes.string),
          }),
        })
      ).isRequired,
    })
  ).isRequired,
};

export default React.memo(NormList);
