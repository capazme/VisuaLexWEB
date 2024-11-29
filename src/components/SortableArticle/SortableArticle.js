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

const { Text } = Typography;

const SortableArticle = React.memo(
  ({ article, index, onArticleClick, onDeleteArticle, onPinArticle, isPinned }) => {
    const { numero_articolo, versione, data_versione, allegato } = article.norma_data;
    const breveDescrizione = article.article_text
      ? article.article_text.split('\n')[0].trim()
      : 'Descrizione non disponibile';
    const position = article.brocardi_info?.position || 'Posizione non disponibile';

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
          >
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Text
                    strong
                    style={{ cursor: 'pointer' }}
                    onClick={() => onArticleClick(article)}
                  >
                    {`Articolo ${numero_articolo}`}
                  </Text>
                  <div style={{ marginLeft: 'auto' }}>
                    <Tooltip
                      title={
                        isPinned ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'
                      }
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
        )}
      </Draggable>
    );
  }
);

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
      position: PropTypes.string,
      link: PropTypes.string,
    }),
  }).isRequired,
  index: PropTypes.number.isRequired,
  onArticleClick: PropTypes.func.isRequired,
  onDeleteArticle: PropTypes.func.isRequired,
  onPinArticle: PropTypes.func.isRequired,
  isPinned: PropTypes.bool.isRequired,
};

export default SortableArticle;
