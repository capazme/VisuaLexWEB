// src/components/ArticleDetail/ArticleDetail.js
import React from 'react';
import { Modal, Typography, Button, message } from 'antd';
import PropTypes from 'prop-types';
import { DownloadOutlined } from '@ant-design/icons';
import { fetchExportPDF } from '../../api/fetchExportPDF'; // Importa la funzione

const { Paragraph, Title, Link } = Typography;

const ArticleDetail = ({ open, article, onClose }) => {
  const handleExportPDF = () => {
    if (article.norma_data.urn) {
      fetchExportPDF(article.norma_data.urn);
    } else {
      message.error('URN dell\'articolo non disponibile.');
    }
  };

  return (
    <Modal
      title={`${article.norma_data.tipo_atto} n.${article.norma_data.numero_atto || 'N/A'} - Articolo ${article.norma_data.numero_articolo}`}
      visible={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Chiudi
        </Button>,
        <Button key="export" type="primary" icon={<DownloadOutlined />} onClick={handleExportPDF}>
          Esporta PDF
        </Button>,
      ]}
      width={800}
    >
      <Title level={5}>Testo dell'Articolo</Title>
      <Paragraph>{article.article_text}</Paragraph>

      {article.brocardi_info && (
        <>
          <Title level={5}>Brocardi</Title>
          <Paragraph>
            <strong>Brocardi:</strong> {article.brocardi_info.Brocardi || 'N/A'}
            <br />
            <strong>Ratio:</strong> {article.brocardi_info.Ratio || 'N/A'}
            <br />
            <strong>Spiegazione:</strong> {article.brocardi_info.Spiegazione || 'N/A'}
            <br />
            <strong>Massime:</strong> {article.brocardi_info.Massime || 'N/A'}
          </Paragraph>
        </>
      )}

      <Title level={5}>Link Utili</Title>
      <Paragraph>
        <Link href={article.link} target="_blank" rel="noopener noreferrer">
          Visita Brocardi
        </Link>
        <br />
        <Link href={article.norma_data.url} target="_blank" rel="noopener noreferrer">
          Consulta Norma su Normattiva
        </Link>
      </Paragraph>
    </Modal>
  );
};

ArticleDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  article: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ArticleDetail;
