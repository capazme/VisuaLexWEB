// src/components/ArticleDetail/ArticleDetail.js
import React from 'react';
import { Modal, Typography } from 'antd';
import PropTypes from 'prop-types';

const { Title, Paragraph } = Typography;

const ArticleDetail = ({ open, article = null, onClose }) => {
  if (!article) return null;

  const { title, article_text } = article;

  return (
    <Modal
      open={open} // Sostituito da 'open'
      onCancel={onClose}
      footer={null}
      title={<Title level={4}>{title || 'Dettaglio Articolo'}</Title>}
      width={800}
      centered
    >
      <Paragraph>{article_text || 'Testo dell\'articolo non disponibile.'}</Paragraph>
    </Modal>
  );
};

ArticleDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  article: PropTypes.shape({
    title: PropTypes.string,
    article_text: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ArticleDetail;
