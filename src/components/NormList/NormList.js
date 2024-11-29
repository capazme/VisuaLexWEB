// src/components/NormList/NormList.js

import React, { useState, useEffect, useCallback } from 'react';
import { List, Typography, Collapse } from 'antd';
import PropTypes from 'prop-types';
import ArticleDetail from '../ArticleDetail/ArticleDetail';
import { v4 as uuidv4 } from 'uuid';
import SortableArticle from '../SortableArticle/SortableArticle';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import './NormList.styles.css';

const { Text } = Typography;
const { Panel } = Collapse;

const NormList = React.memo(({ data }) => {
  const [articlesData, setArticlesData] = useState({});
  const [pinnedArticles, setPinnedArticles] = useState([]);
  const [openArticles, setOpenArticles] = useState([]);
  const [zIndices, setZIndices] = useState({});
  const [highestZIndex, setHighestZIndex] = useState(1000);

  // Load pinned articles from localStorage
  useEffect(() => {
    const storedPinned = localStorage.getItem('pinnedArticles');
    if (storedPinned) {
      setPinnedArticles(JSON.parse(storedPinned));
    }
  }, []);

  // Save pinned articles to localStorage
  useEffect(() => {
    localStorage.setItem('pinnedArticles', JSON.stringify(pinnedArticles));
  }, [pinnedArticles]);

  // Initialize articlesData
  useEffect(() => {
    const groupedArticles = {};

    data.forEach((norm) => {
      const normKey = norm.key || uuidv4();
      const normInfo = norm.info;

      const articlesWithIds = norm.articles.map((article) => ({
        ...article,
        id: article.id ? article.id.toString() : uuidv4(),
        normKey,
        normInfo,
      }));

      // Sort articles, placing pinned ones at the top
      const sortedArticles = [
        ...articlesWithIds.filter((article) => pinnedArticles.includes(article.id)),
        ...articlesWithIds.filter((article) => !pinnedArticles.includes(article.id)),
      ];

      groupedArticles[normKey] = {
        normInfo,
        articles: sortedArticles,
      };
    });

    setArticlesData(groupedArticles);
  }, [data, pinnedArticles]);

  // Drag and drop handler
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceNormKey = result.source.droppableId;
    const destNormKey = result.destination.droppableId;

    const sourceArticles = Array.from(articlesData[sourceNormKey].articles);
    const destArticles = Array.from(articlesData[destNormKey].articles);

    const [movedArticle] = sourceArticles.splice(result.source.index, 1);

    // Update the normKey if moved to a different norm
    if (sourceNormKey !== destNormKey) {
      movedArticle.normKey = destNormKey;
    }

    destArticles.splice(result.destination.index, 0, movedArticle);

    setArticlesData({
      ...articlesData,
      [sourceNormKey]: {
        ...articlesData[sourceNormKey],
        articles: sourceArticles,
      },
      [destNormKey]: {
        ...articlesData[destNormKey],
        articles: destArticles,
      },
    });
  };

  // Article actions
  const bringToFront = useCallback(
    (articleId) => {
      setHighestZIndex((prev) => prev + 1);
      setZIndices((prevState) => ({
        ...prevState,
        [articleId]: highestZIndex + 1,
      }));
    },
    [highestZIndex]
  );

  const handleArticleClick = useCallback(
    (article) => {
      setOpenArticles((prevArticles) => {
        if (prevArticles.find((a) => a.id === article.id)) {
          bringToFront(article.id);
          return prevArticles;
        }
        bringToFront(article.id);
        return [...prevArticles, article];
      });
    },
    [bringToFront]
  );

  const handleCloseArticle = useCallback((articleId) => {
    setOpenArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== articleId)
    );
    setZIndices((prevState) => {
      const newZIndices = { ...prevState };
      delete newZIndices[articleId];
      return newZIndices;
    });
  }, []);

  const handleDeleteArticle = (articleId) => {
    const updatedArticlesData = { ...articlesData };
    Object.keys(updatedArticlesData).forEach((normKey) => {
      const normGroup = updatedArticlesData[normKey];
      normGroup.articles = normGroup.articles.filter(
        (article) => article.id !== articleId
      );
    });
    setArticlesData(updatedArticlesData);
    setPinnedArticles((prevPinned) =>
      prevPinned.filter((id) => id !== articleId)
    );
  };

  const handlePinArticle = (articleId) => {
    setPinnedArticles((prevPinned) => {
      if (prevPinned.includes(articleId)) {
        return prevPinned.filter((id) => id !== articleId);
      } else {
        return [articleId, ...prevPinned];
      }
    });
  };

  if (Object.keys(articlesData).length === 0) {
    return <Text type="secondary">Nessun risultato da visualizzare.</Text>;
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Collapse accordion>
          {Object.keys(articlesData).map((normKey) => {
            const normGroup = articlesData[normKey];
            const normInfo = normGroup.normInfo;
            const panelHeader = `${normInfo.tipo_atto} ${
              normInfo.numero_atto ? normInfo.numero_atto : ''
            } ${normInfo.data ? `(${normInfo.data})` : ''}`;

            return (
              <Panel header={panelHeader} key={normKey}>
                <Droppable droppableId={normKey}>
                  {(provided) => (
                    <List
                      itemLayout="horizontal"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {normGroup.articles.map((article, index) => (
                        <SortableArticle
                          key={article.id}
                          article={article}
                          index={index}
                          onArticleClick={handleArticleClick}
                          onDeleteArticle={handleDeleteArticle}
                          onPinArticle={handlePinArticle}
                          isPinned={pinnedArticles.includes(article.id)}
                        />
                      ))}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              </Panel>
            );
          })}
        </Collapse>
      </DragDropContext>

      {openArticles.map((article) => (
        <ArticleDetail
          key={article.id}
          article={article}
          onClose={() => handleCloseArticle(article.id)}
          zIndex={zIndices[article.id] || 1000}
          bringToFront={() => bringToFront(article.id)}
        />
      ))}
    </>
  );
});

NormList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
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
            position: PropTypes.string,
            link: PropTypes.string,
          }),
        })
      ).isRequired,
    })
  ).isRequired,
};

export default NormList;
