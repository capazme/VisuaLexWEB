// src/components/SortableArticle/SortableArticle.js

import React from 'react';
import { List, Typography, Button, Tooltip } from 'antd';
import {
  DeleteOutlined,
  PushpinOutlined,
  PushpinFilled,
} from '@ant-design/icons';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import './SortableArticle.styles.css';

const { Text } = Typography;

const SortableArticle = ({
  article,
  index,
  onArticleClick,
  onDeleteArticle,
  onPinArticle,
  isPinned,
}) => {
  const { numero_articolo, versione, data_versione, allegato } = article.norma_data;

  // Extract the line after the article number from article_text
  let breveDescrizione = 'Descrizione non disponibile';
  if (article.article_text) {
    const lines = article.article_text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);
    // Assuming the first line is the article number, the second line is the title or first comma
    if (lines.length > 1) {
      breveDescrizione = lines[1];
    } else if (lines.length === 1) {
      breveDescrizione = lines[0];
    }
  }

  // Indicate the presence of Brocardi explanations and number of Massime
  const hasSpiegazione = article.brocardi_info?.Spiegazione ? true : false;
  const numMassime = article.brocardi_info?.Massime ? article.brocardi_info.Massime.length : 0;

  return (
    <Draggable draggableId={article.id} index={index}>
      {(provided, snapshot) => (
        <List.Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.5 : 1,
            cursor: 'move',
          }}
          className="sortable-article"
        >
          <List.Item.Meta
            title={
              <div className="article-title">
                <Text
                  strong
                  style={{ cursor: 'pointer' }}
                  onClick={() => onArticleClick(article)}
                >
                  {`Articolo ${numero_articolo}`}
                </Text>
                <div className="article-actions">
                  <Tooltip
                    title={isPinned ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                  >
                    <Button
                      type="text"
                      icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
                      onClick={() => onPinArticle(article.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Elimina articolo">
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => onDeleteArticle(article.id)}
                    />
                  </Tooltip>
                </div>
              </div>
            }
            description={
              <>
                <Text
                  style={{ cursor: 'pointer' }}
                  onClick={() => onArticleClick(article)}
                >
                  {breveDescrizione}
                </Text>
                <br />
                <Text type="secondary">
                  {hasSpiegazione && 'Ha spiegazione Brocardi'}
                  {hasSpiegazione && numMassime > 0 && ' | '}
                  {numMassime > 0 && `Massime: ${numMassime}`}
                </Text>
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
      )}
    </Draggable>
  );
};

SortableArticle.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
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
  }).isRequired,
  index: PropTypes.number.isRequired,
  onArticleClick: PropTypes.func.isRequired,
  onDeleteArticle: PropTypes.func.isRequired,
  onPinArticle: PropTypes.func.isRequired,
  isPinned: PropTypes.bool.isRequired,
};

export default React.memo(SortableArticle);
