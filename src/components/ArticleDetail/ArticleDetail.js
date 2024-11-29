// ArticleDetail.js
import React, { useState, useEffect } from 'react';
import { Typography, Button, Collapse, message, Card } from 'antd';
import { MinusOutlined, ExpandOutlined, CloseOutlined, CopyOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Rnd } from 'react-rnd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ArticleDetail.styles.css';

const { Title } = Typography;

const ArticleDetail = ({ article, onClose, zIndex, bringToFront }) => {
  const [editorData, setEditorData] = useState('Caricamento...');
  const [isMinimized, setIsMinimized] = useState(false);

  const [selectedItems, setSelectedItems] = useState({
    brocardi: [],
    massime: [],
    spiegazione: false,
    position: false,
  });

  useEffect(() => {
    if (article.article_text) {
      const formattedText = article.article_text.replace(/\n/g, '<br/>');
      setEditorData(formattedText);
    } else {
      setEditorData('Testo non disponibile.');
    }
  }, [article]);

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  const handleCopy = async () => {
    try {
      let plainText = editorData
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '');

      let additionalText = '';

      if (selectedItems.brocardi.length > 0) {
        const selectedBrocardi = selectedItems.brocardi.map(
          (index) => article.brocardi_info.Brocardi[index]
        );
        additionalText += '\n\nBrocardi:\n' + selectedBrocardi.join('\n\n');
      }

      if (selectedItems.massime.length > 0) {
        const selectedMassime = selectedItems.massime.map(
          (originalIndex) => article.brocardi_info.Massime[originalIndex]
        );
        additionalText += '\n\nMassime:\n' + selectedMassime.join('\n\n');
      }

      if (selectedItems.spiegazione) {
        additionalText += '\n\nSpiegazione:\n' + article.brocardi_info.Spiegazione;
      }

      if (selectedItems.position) {
        additionalText += '\n\nPosizione:\n' + article.brocardi_info.position;
      }

      const textToCopy = plainText + additionalText;

      await navigator.clipboard.writeText(textToCopy);
      message.success('Testo copiato negli appunti.');
    } catch (err) {
      console.error('Errore durante la copia del testo:', err);
      message.error('Impossibile copiare il testo.');
    }
  };

  const handleBrocardiSelection = (index) => {
    setSelectedItems((prevState) => {
      const brocardi = prevState.brocardi.includes(index)
        ? prevState.brocardi.filter((i) => i !== index)
        : [...prevState.brocardi, index];
      return { ...prevState, brocardi };
    });
  };

  const handleMassimeSelection = (originalIndex) => {
    setSelectedItems((prevState) => {
      const massime = prevState.massime.includes(originalIndex)
        ? prevState.massime.filter((i) => i !== originalIndex)
        : [...prevState.massime, originalIndex];
      return { ...prevState, massime };
    });
  };

  if (isMinimized) {
    return (
      <div className="minimized-window" onClick={handleExpand}>
        <ExpandOutlined style={{ fontSize: '24px' }} />
      </div>
    );
  }

  // Preparazione dei pannelli per Collapse
  const panels = [];

  if (article.brocardi_info?.Brocardi) {
    panels.push({
      key: 'brocardi',
      label: 'Brocardi',
      children: (
        <div className="brocardi-container">
          {article.brocardi_info.Brocardi.map((item, index) => (
            <Card
              key={index}
              hoverable
              className={classNames('selectable-card', {
                'card-selected': selectedItems.brocardi.includes(index),
              })}
              onClick={() => handleBrocardiSelection(index)}
            >
              <pre className="card-content">{item}</pre>
            </Card>
          ))}
        </div>
      ),
    });
  }

  if (article.brocardi_info?.Massime) {
    const validMassime = article.brocardi_info.Massime
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => item && item.trim() !== '');

    panels.push({
      key: 'massime',
      label: 'Massime',
      children: (
        <div className="massime-container">
          {validMassime.map(({ item, originalIndex }) => (
            <Card
              key={originalIndex}
              hoverable
              className={classNames('selectable-card', {
                'card-selected': selectedItems.massime.includes(originalIndex),
              })}
              onClick={() => handleMassimeSelection(originalIndex)}
            >
              <div className="card-content">
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{item}</pre>
              </div>
            </Card>
          ))}
        </div>
      ),
    });
  }

  if (article.brocardi_info?.Spiegazione) {
    panels.push({
      key: 'spiegazione',
      label: 'Spiegazione',
      children: (
        <Card
          hoverable
          className={classNames('selectable-card', {
            'card-selected': selectedItems.spiegazione,
          })}
          onClick={() =>
            setSelectedItems((prevState) => ({
              ...prevState,
              spiegazione: !prevState.spiegazione,
            }))
          }
        >
          <div className="spiegazione-content">
            {article.brocardi_info.Spiegazione}
          </div>
        </Card>
      ),
    });
  }

  return (
    <Rnd
      default={{
        x: window.innerWidth / 6,
        y: window.innerHeight / 6,
        width: 800,
        height: 600,
      }}
      minWidth={400}
      minHeight={300}
      bounds="window"
      className="article-detail-rnd"
      style={{ zIndex }}
      enableUserSelectHack={false}
      dragHandleClassName="modal-header"
      onMouseDown={bringToFront}
      onTouchStart={bringToFront}
    >
      <div className="article-detail-modal">
        {/* Header */}
        <div className="modal-header">
          <Title level={4} style={{ margin: 0 }}>
            {`${article.norma_data?.tipo_atto || 'Documento'} - Articolo ${
              article.norma_data?.numero_articolo || 'N/A'
            }`}
          </Title>
          <div>
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={handleCopy}
              style={{ marginRight: '8px' }}
            />
            <Button
              icon={<MinusOutlined />}
              size="small"
              onClick={handleMinimize}
              style={{ marginRight: '8px' }}
            />
            <Button icon={<CloseOutlined />} size="small" onClick={onClose} />
          </div>
        </div>

        {/* Posizione */}
        {article.brocardi_info?.position && article.brocardi_info?.link && (
          <Card
            hoverable
            className={classNames('selectable-card', {
              'card-selected': selectedItems.position,
            })}
            onClick={() =>
              setSelectedItems((prevState) => ({
                ...prevState,
                position: !prevState.position,
              }))
            }
            style={{ margin: '16px', marginBottom: 0 }}
          >
            <Typography.Text>
              Posizione:{' '}
              <Typography.Link
                href={article.brocardi_info.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {article.brocardi_info.position}
              </Typography.Link>
            </Typography.Text>
          </Card>
        )}
        {/* Content */}
        <div className="article-content">
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
            }}
            config={{
              toolbar: ['heading', '|', 'bold', 'italic', '|', 'undo', 'redo'],
            }}
          />

          {/* Brocardi, Massime, Spiegazione */}
          {panels.length > 0 && <Collapse style={{ marginTop: '16px' }} items={panels} />}
        </div>
      </div>
    </Rnd>
  );
};

ArticleDetail.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    article_text: PropTypes.string,
    norma_data: PropTypes.shape({
      tipo_atto: PropTypes.string,
      numero_articolo: PropTypes.string,
      urn: PropTypes.string,
    }),
    brocardi_info: PropTypes.shape({
      Brocardi: PropTypes.arrayOf(PropTypes.string),
      Massime: PropTypes.arrayOf(PropTypes.string),
      Spiegazione: PropTypes.string,
      position: PropTypes.string,
      link: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  zIndex: PropTypes.number.isRequired,
  bringToFront: PropTypes.func.isRequired,
};

export default ArticleDetail;
