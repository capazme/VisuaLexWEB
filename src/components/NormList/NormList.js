// src/components/NormList/NormList.js
import React from 'react';
import { Collapse, List, Typography } from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;

const NormList = ({ data, onArticleClick }) => {
  if (data.length === 0) {
    return <Text type="secondary">Nessun risultato da visualizzare.</Text>;
  }

  // Converti i dati in formato compatibile con il prop 'items'
  const collapseItems = data.map((norm) => ({
    key: `${norm.info.tipo_atto}-${norm.info.numero_atto}-${norm.info.data}`,
    label: `${norm.info.tipo_atto} n° ${norm.info.numero_atto} (${norm.info.data})`,
    children: (
      <List
        itemLayout="horizontal"
        dataSource={norm.articles}
        renderItem={(article) => (
          <List.Item
            onClick={() => onArticleClick(article)}
            style={{ cursor: 'pointer' }}
          >
            <List.Item.Meta
              title={`Articolo ${article.norma_data.numero_articolo}`}
              description={article.norma_data.breve_descrizione || 'Descrizione non disponibile'}
            />
          </List.Item>
        )}
      />
    ),
  }));

  return <Collapse accordion items={collapseItems} />;
};

NormList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      info: PropTypes.object.isRequired,
      articles: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ).isRequired,
  onArticleClick: PropTypes.func.isRequired,
};

export default NormList;
