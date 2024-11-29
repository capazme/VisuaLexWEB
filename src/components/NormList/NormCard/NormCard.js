// src/components/NormCard/NormCard.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, List, Typography, Button, Tooltip } from 'antd';
import { Droppable } from 'react-beautiful-dnd';
import { Rnd } from 'react-rnd';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import SortableArticle from '../../SortableArticle/SortableArticle';
import './NormCard.styles.css';

const { Text } = Typography;

const NormCard = ({
  normKey,
  normGroup,
  pinnedArticles,
  onOpenArticle,
  setPinnedArticles,
  position,
  onUpdatePosition,
  highestZIndex,
  setHighestZIndex,
  onDeleteNorm,
  currentZIndex,
  updateZIndex,
}) => {
  const { normInfo, articles } = normGroup;
  const normTitle = `${normInfo.tipo_atto} ${
    normInfo.numero_atto ? normInfo.numero_atto : ''
  } ${normInfo.data ? `(${normInfo.data})` : ''}`;

  const [size, setSize] = useState({
    width: position?.width || 320,
    height: position?.height || 400,
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDragStop = (_, data) => {
    onUpdatePosition(normKey, { x: data.x, y: data.y, ...size });
  };

  const handleResizeStop = (_, __, ref) => {
    const newWidth = ref.style.width.replace('px', '');
    const newHeight = ref.style.height.replace('px', '');
    setSize({ width: parseInt(newWidth, 10), height: parseInt(newHeight, 10) });
    onUpdatePosition(normKey, { ...position, width: newWidth, height: newHeight });
  };

  const handleClick = () => {
    updateZIndex(normKey); // Porta questa finestra in primo piano
  };

  const handleCollapse = () => {
    setIsCollapsed((prev) => !prev);

    if (!isCollapsed) {
      setSize((prevSize) => ({
        ...prevSize,
        height: 58, // Altezza minima quando collassato
      }));
      onUpdatePosition(normKey, { ...position, height: 50 });
    } else {
      const newHeight = Math.max(position?.height || 400, window.innerHeight * 0.5); // 15vh minimo
      setSize((prevSize) => ({
        ...prevSize,
        height: newHeight,
      }));
      onUpdatePosition(normKey, { ...position, height: newHeight });
    }
  };

  const handleDelete = () => {
    onDeleteNorm(normKey);
  };

  return (
    <Rnd
      default={{
        x: position?.x || 100,
        y: position?.y || 100,
        width: size.width,
        height: size.height,
      }}
      size={{ width: size.width, height: size.height }}
      enableResizing={!isCollapsed}
      bounds="window"
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      style={{ zIndex: currentZIndex }} // Usa lo stato del currentZIndex per questa finestra
      onMouseDown={handleClick} // Aggiorna lo z-index quando la finestra viene cliccata
    >
      <Card
        title={
          <div className="norm-card-header">
            <span>{normTitle}</span>
            <div className="norm-card-actions">
              <Tooltip title={isCollapsed ? 'Espandi' : 'Collassa'}>
                <Button
                  type="text"
                  size="small"
                  icon={isCollapsed ? <PlusOutlined /> : <MinusOutlined />}
                  onClick={handleCollapse}
                />
              </Tooltip>
              <Tooltip title="Elimina Norma">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleDelete}
                />
              </Tooltip>
            </div>
          </div>
        }
        bordered
        className="norm-card"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
        bodyStyle={{
          padding: 0,
          height: isCollapsed ? '0px' : 'calc(100% - 48px)',
          overflowY: isCollapsed ? 'hidden' : 'auto',
        }}
      >
        {!isCollapsed && (
          articles.length === 0 ? (
            <div className="empty-articles">
              <Text type="secondary">Nessun articolo disponibile.</Text>
            </div>
          ) : (
            <Droppable droppableId={normKey} type="ARTICLE">
              {(provided, snapshot) => (
                <List
                  itemLayout="horizontal"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`article-list ${
                    snapshot.isDraggingOver ? 'dragging-over' : ''
                  }`}
                  style={{
                    padding: '8px',
                    height: '100%',
                    overflowY: 'auto',
                    backgroundColor: snapshot.isDraggingOver
                      ? '#e6f7ff'
                      : 'transparent',
                  }}
                >
                  {articles.map((article, index) => (
                    <SortableArticle
                      key={article.id}
                      article={article}
                      index={index}
                      onOpenArticle={onOpenArticle}
                      pinnedArticles={pinnedArticles}
                      setPinnedArticles={setPinnedArticles}
                    />
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          )
        )}
      </Card>
    </Rnd>
  );
};

NormCard.propTypes = {
  normKey: PropTypes.string.isRequired,
  normGroup: PropTypes.shape({
    normInfo: PropTypes.shape({
      tipo_atto: PropTypes.string.isRequired,
      numero_atto: PropTypes.string,
      data: PropTypes.string,
    }),
    articles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        norma_data: PropTypes.object.isRequired,
        article_text: PropTypes.string,
        brocardi_info: PropTypes.object,
      })
    ).isRequired,
  }).isRequired,
  pinnedArticles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOpenArticle: PropTypes.func.isRequired,
  setPinnedArticles: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  onUpdatePosition: PropTypes.func.isRequired,
  highestZIndex: PropTypes.number.isRequired,
  setHighestZIndex: PropTypes.func.isRequired,
  currentZIndex: PropTypes.number.isRequired,
  updateZIndex: PropTypes.func.isRequired,
  onDeleteNorm: PropTypes.func.isRequired,
};

export default NormCard;
