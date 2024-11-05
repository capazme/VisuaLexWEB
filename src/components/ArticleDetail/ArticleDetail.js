// src/components/ArticleDetail/ArticleDetail.js
import React from 'react';
import { Modal, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const ArticleDetail = ({ open, article, onClose }) => (
  <Modal
    open={open}
    onCancel={onClose}
    footer={null}
    title={<Title level={4}>{article.title || 'Dettaglio Articolo'}</Title>}
  >
    <Paragraph>{article.article_text}</Paragraph>
  </Modal>
);

export default ArticleDetail;
