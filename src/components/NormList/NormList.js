// src/components/NormList/NormList.js
import React from 'react';
import { Collapse, List, Typography, Badge } from 'antd';
import PropTypes from 'prop-types';
import './NormList.styles.css'; // Importa il CSS opzionale

const { Text } = Typography;
const { Panel } = Collapse;

/**
 * Funzione helper per capitalizzare la prima lettera di una stringa.
 * @param {string} stringa - La stringa da capitalizzare.
 * @returns {string} - La stringa con la prima lettera capitalizzata.
 */
const capitalizeFirstLetter = (stringa) => {
  if (!stringa) return '';
  return stringa.charAt(0).toUpperCase() + stringa.slice(1);
};

const NormList = React.memo(({ data, onArticleClick }) => {
  if (data.length === 0) {
    return <Text type="secondary">Nessun risultato da visualizzare.</Text>;
  }

  // Converti i dati in formato compatibile con il Collapse
  const collapsePanels = data.map((norm) => {
    const { tipo_atto, numero_atto, data: dataNorma } = norm.info;
    const numeroArticoli = norm.articles.length;
    const key = `${tipo_atto}-${numero_atto}-${dataNorma}`;
    const tipoAttoCapitalized = capitalizeFirstLetter(tipo_atto);

    // Costruisci il label includendo solo gli elementi definiti
    let label = tipoAttoCapitalized;
    if (numero_atto) {
      label += ` n° ${numero_atto}`;
    }
    if (dataNorma) {
      label += ` (${dataNorma})`;
    }

    return (
      <Panel
        header={
          <span>
            {label}{' '}
            <Badge
              count={numeroArticoli}
              showZero
              style={{ backgroundColor: '#52c41a', marginLeft: '8px' }}
              title={`${numeroArticoli} articolo${numeroArticoli > 1 ? 'i' : ''}`}
            />
          </span>
        }
        key={key}
      >
        <List
          itemLayout="horizontal"
          dataSource={norm.articles}
          renderItem={(article) => {
            const { numero_articolo, versione, data_versione, allegato } = article.norma_data;
            const breveDescrizione = article.article_text
              ? article.article_text.split('\n')[0].trim() // Usa la prima riga del testo dell'articolo come descrizione
              : 'Descrizione non disponibile';
            return (
              <List.Item
                onClick={() => onArticleClick(article)}
                style={{ cursor: 'pointer', padding: '8px 16px' }}
                aria-label={`Articolo ${numero_articolo}`}
              >
                <List.Item.Meta
                  title={<Text strong>{`Articolo ${numero_articolo}`}</Text>}
                  description={
                    <>
                      <Text>{breveDescrizione}</Text>
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
          }}
        />
      </Panel>
    );
  });

  return <Collapse accordion>{collapsePanels}</Collapse>;
});

NormList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      info: PropTypes.shape({
        tipo_atto: PropTypes.string.isRequired,
        numero_atto: PropTypes.string,
        data: PropTypes.string,
      }).isRequired,
      articles: PropTypes.arrayOf(
        PropTypes.shape({
          norma_data: PropTypes.shape({
            numero_articolo: PropTypes.string.isRequired,
            versione: PropTypes.string.isRequired,
            data_versione: PropTypes.string,
            allegato: PropTypes.string,
          }).isRequired,
          article_text: PropTypes.string,
          url: PropTypes.string,
          brocardi_info: PropTypes.object,
        })
      ).isRequired,
    })
  ).isRequired,
  onArticleClick: PropTypes.func.isRequired,
};

export default NormList;
