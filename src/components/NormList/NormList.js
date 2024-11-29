// src/components/NormList/NormList.js
import React, { useState } from 'react';
import { Collapse, List, Typography, Badge } from 'antd';
import PropTypes from 'prop-types';
import ArticleDetail from '../ArticleDetail/ArticleDetail';
import './NormList.styles.css';

const { Text } = Typography;

const capitalizeFirstLetter = (stringa) => {
  if (!stringa) return '';
  return stringa.charAt(0).toUpperCase() + stringa.slice(1);
};

const groupArticlesByNorm = (data) => {
  const grouped = {};

  data.forEach((norm) => {
    const key = `${norm.info.tipo_atto}-${norm.info.numero_atto || ''}-${norm.info.data || ''}`;

    if (!grouped[key]) {
      grouped[key] = { ...norm, articles: [] };
    }

    grouped[key].articles.push(...norm.articles);
  });

  return Object.values(grouped);
};

const NormList = React.memo(({ data }) => {
  const [openArticles, setOpenArticles] = useState([]);
  const [zIndices, setZIndices] = useState({});
  const [highestZIndex, setHighestZIndex] = useState(1000);

  const bringToFront = (articleId) => {
    setHighestZIndex((prev) => prev + 1);
    setZIndices((prevState) => ({
      ...prevState,
      [articleId]: highestZIndex + 1,
    }));
  };

  const handleArticleClick = (article) => {
    setOpenArticles((prevArticles) => {
      if (prevArticles.find((a) => a.id === article.id)) {
        bringToFront(article.id);
        return prevArticles;
      }
      bringToFront(article.id);
      return [...prevArticles, article];
    });
  };

  const handleCloseArticle = (articleId) => {
    setOpenArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== articleId)
    );
    setZIndices((prevState) => {
      const newZIndices = { ...prevState };
      delete newZIndices[articleId];
      return newZIndices;
    });
  };

  if (data.length === 0) {
    return <Text type="secondary">Nessun risultato da visualizzare.</Text>;
  }

  const groupedData = groupArticlesByNorm(data);

  const collapseItems = groupedData.map((norm, index) => {
    const { tipo_atto, numero_atto, data: dataNorma } = norm.info;
    const numeroArticoli = norm.articles.length;
    const key = `${tipo_atto}-${numero_atto || ''}-${dataNorma || ''}-${index}`;
    const tipoAttoCapitalized = capitalizeFirstLetter(tipo_atto);

    let label = tipoAttoCapitalized;
    if (numero_atto) {
      label += ` n° ${numero_atto}`;
    }
    if (dataNorma) {
      label += ` (${dataNorma})`;
    }

    const articlesList = norm.articles.map((article, idx) => {
      const articleWithId = {
        ...article,
        id: article.id || `${key}-article-${idx}`,
      };

      const { numero_articolo, versione, data_versione, allegato } = articleWithId.norma_data;
      const breveDescrizione = articleWithId.article_text
        ? articleWithId.article_text.split('\n')[0].trim()
        : 'Descrizione non disponibile';
      const position = articleWithId.brocardi_info?.position || 'Posizione non disponibile';

      return (
        <List.Item
          key={articleWithId.id}
          onClick={() => handleArticleClick(articleWithId)}
          style={{ cursor: 'pointer', padding: '8px 16px' }}
          aria-label={`Articolo ${numero_articolo}`}
        >
          <List.Item.Meta
            title={<Text strong>{`Articolo ${numero_articolo}`}</Text>}
            description={
              <>
                <Text>{breveDescrizione}</Text>
                <br />
                <Text type="secondary">Posizione: {position}</Text>
                <br />
                <Text type="secondary">Versione: {versione}</Text>
                {data_versione && (
                  <>
                    {' | '}
                    <Text type="secondary">Data Versione: {data_versione}</Text>
                  </>
                )}
                {allegato && (
                  <>
                    {' | '}
                    <Text type="secondary">Allegato: {allegato}</Text>
                  </>
                )}
              </>
            }
          />
        </List.Item>
      );
    });

    return {
      key,
      label: (
        <span>
          {label}{' '}
          <Badge
            count={numeroArticoli}
            showZero
            style={{ backgroundColor: '#52c41a', marginLeft: '8px' }}
            title={`${numeroArticoli} articolo${numeroArticoli > 1 ? 'i' : ''}`}
          />
        </span>
      ),
      children: <List itemLayout="horizontal">{articlesList}</List>,
    };
  });

  return (
    <>
      <Collapse accordion items={collapseItems} />
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
      key: PropTypes.string.isRequired,
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
            versione: PropTypes.string.isRequired,
            data_versione: PropTypes.string,
            allegato: PropTypes.string,
          }).isRequired,
          article_text: PropTypes.string,
          url: PropTypes.string,
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
