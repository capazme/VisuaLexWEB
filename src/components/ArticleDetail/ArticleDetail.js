// Importazioni
import React, { useState, useEffect } from 'react';
import { Typography, Button, Collapse, message, Card } from 'antd';
import {
  MinusOutlined,
  ExpandOutlined,
  CloseOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Rnd } from 'react-rnd';
import PropTypes from 'prop-types';
import './ArticleDetail.styles.css';

const { Title } = Typography;

const ArticleDetail = ({ article, onClose }) => {
  const [editorData, setEditorData] = useState('Caricamento...');
  const [isMinimized, setIsMinimized] = useState(false);

  const [selectedItems, setSelectedItems] = useState({
    brocardi: [],
    massime: [],
    spiegazione: false,
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
      <div
        className="article-detail-minimized"
        onClick={handleExpand}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          backgroundColor: '#1890ff',
          borderRadius: '50%',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {article.brocardi_info.Brocardi.map((item, index) => (
            <Card
              key={index}
              hoverable
              style={{
                width: '100%',
                borderColor: selectedItems.brocardi.includes(index) ? '#1890ff' : '#f0f0f0',
                backgroundColor: selectedItems.brocardi.includes(index) ? '#e6f7ff' : '#fff',
              }}
              onClick={() => handleBrocardiSelection(index)}
            >
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{item}</pre>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {validMassime.map(({ item, originalIndex }) => (
            <Card
              key={originalIndex}
              hoverable
              style={{
                borderColor: selectedItems.massime.includes(originalIndex) ? '#1890ff' : '#f0f0f0',
                backgroundColor: selectedItems.massime.includes(originalIndex) ? '#e6f7ff' : '#fff',
              }}
              onClick={() => handleMassimeSelection(originalIndex)}
            >
              <div
                style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  resize: 'vertical',
                }}
              >
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
      label: (
        <div
          style={{ cursor: 'pointer', color: selectedItems.spiegazione ? '#1890ff' : 'inherit' }}
          onClick={() =>
            setSelectedItems((prevState) => ({
              ...prevState,
              spiegazione: !prevState.spiegazione,
            }))
          }
        >
          {selectedItems.spiegazione ? <strong>Spiegazione</strong> : 'Spiegazione'}
        </div>
      ),
      children: (
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {article.brocardi_info.Spiegazione}
        </pre>
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
      style={{ zIndex: 999 }}
      enableUserSelectHack={false}
      dragHandleClassName="modal-header" // Solo la header è draggabile
    >
      <div
        className="article-detail-modal"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            background: '#f0f2f5',
            borderBottom: '1px solid #d9d9d9',
          }}
        >
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

        {/* Content */}
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          {/* Posizione come etichetta con link */}
          {article.brocardi_info?.position && article.brocardi_info?.link && (
            <div style={{ marginBottom: '16px' }}>
              <Typography.Text>
                Posizione:{' '}
                <Typography.Link
                  href={article.brocardi_info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.brocardi_info.position}
                </Typography.Link>
              </Typography.Text>
            </div>
          )}

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

          {/* Informazioni Brocardi e Massime */}
          {panels.length > 0 && (
            <Collapse style={{ marginTop: '16px' }} items={panels} />
          )}
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
};

export default ArticleDetail;
