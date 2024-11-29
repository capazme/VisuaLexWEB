// src/components/NormList/NormList.js

import React, { useState, useEffect, useCallback } from 'react';
import { List, Typography, Card, Row, Col, message } from 'antd';
import PropTypes from 'prop-types';
import ArticleDetail from '../ArticleDetail/ArticleDetail';
import { v4 as uuidv4 } from 'uuid';
import SortableArticle from '../SortableArticle/SortableArticle';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import './NormList.styles.css';

const { Text } = Typography;

const NormList = ({ data }) => {
  const [articlesData, setArticlesData] = useState({});
  const [pinnedArticles, setPinnedArticles] = useState([]);
  const [openArticles, setOpenArticles] = useState([]);
  const [zIndices, setZIndices] = useState({});
  const [highestZIndex, setHighestZIndex] = useState(1000);

  // Load pinned articles from localStorage
  useEffect(() => {
    try {
      const storedPinned = localStorage.getItem('pinnedArticles');
      if (storedPinned) {
        setPinnedArticles(JSON.parse(storedPinned));
      }
    } catch (error) {
      console.error('Failed to load pinned articles:', error);
      message.error('Errore nel caricamento dei preferiti.');
    }
  }, []);

  // Save pinned articles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pinnedArticles', JSON.stringify(pinnedArticles));
    } catch (error) {
      console.error('Failed to save pinned articles:', error);
      message.error('Errore nel salvataggio dei preferiti.');
    }
  }, [pinnedArticles]);

  // Initialize articlesData
  useEffect(() => {
    const groupedArticles = {};

    data.forEach((norm) => {
      // Construct a unique and valid normKey
      const normType = norm.info.tipo_atto || 'Norma';
      const normNumber = norm.info.numero_atto || uuidv4();
      const normDate = norm.info.data || 'NoDate';
      const normKey = `${normType}-${normNumber}-${normDate}`;

      if (!groupedArticles[normKey]) {
        groupedArticles[normKey] = {
          normInfo: norm.info,
          articles: [],
        };
      }

      const articlesWithIds = norm.articles.map((article) => {
        const articleId = article.id ? article.id.toString() : uuidv4();
        return {
          ...article,
          id: articleId,
          normKey,
          normInfo: norm.info,
        };
      });

      // Sort articles, placing pinned ones at the top
      const sortedArticles = [
        ...articlesWithIds.filter((article) => pinnedArticles.includes(article.id)),
        ...articlesWithIds.filter((article) => !pinnedArticles.includes(article.id)),
      ];

      groupedArticles[normKey].articles = sortedArticles;
    });

    setArticlesData(groupedArticles);
  }, [data, pinnedArticles]);

  // Drag and drop handler
  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      message.warning('Nessuna destinazione valida per il trascinamento.');
      return;
    }

    const sourceNormKey = source.droppableId;
    const destNormKey = destination.droppableId;

    if (
      sourceNormKey === destNormKey &&
      source.index === destination.index
    ) {
      return; // No change in position
    }

    const sourceArticles = Array.from(articlesData[sourceNormKey].articles);
    const destArticles = Array.from(articlesData[destNormKey].articles);

    const [movedArticle] = sourceArticles.splice(source.index, 1);

    // Update the normKey if moved to a different norm
    if (sourceNormKey !== destNormKey) {
      movedArticle.normKey = destNormKey;
    }

    destArticles.splice(destination.index, 0, movedArticle);

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

    message.success('Articolo spostato con successo.');
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
    message.success('Articolo eliminato con successo.');
  };

  const handlePinArticle = (articleId) => {
    setPinnedArticles((prevPinned) => {
      if (prevPinned.includes(articleId)) {
        message.info('Articolo rimosso dai preferiti.');
        return prevPinned.filter((id) => id !== articleId);
      } else {
        message.success('Articolo aggiunto ai preferiti.');
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
        <Row gutter={[16, 16]} className="norm-grid">
          {Object.keys(articlesData).map((normKey) => {
            const normGroup = articlesData[normKey];
            const normInfo = normGroup.normInfo;
            const normTitle = `${normInfo.tipo_atto} ${
              normInfo.numero_atto ? normInfo.numero_atto : ''
            } ${normInfo.data ? `(${normInfo.data})` : ''}`;

            return (
              <Col key={normKey} xs={24} sm={12} md={8}>
                <Card title={normTitle} className="norm-card">
                  <Droppable droppableId={normKey} type="ARTICLE">
                    {(provided, snapshot) => (
                      <List
                        itemLayout="horizontal"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`article-list ${
                          snapshot.isDraggingOver ? 'dragging-over' : ''
                        }`}
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
                </Card>
              </Col>
            );
          })}
        </Row>
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
