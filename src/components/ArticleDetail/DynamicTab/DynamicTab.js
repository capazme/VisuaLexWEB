// src/components/ArticleDetail/DynamicTab/DynamicTab.js
import React from 'react';
import { Tabs, Typography } from 'antd';

const { TabPane } = Tabs;
const { Paragraph } = Typography;

const DynamicTab = ({ article }) => (
  <Tabs defaultActiveKey="1">
    <TabPane tab="Testo" key="1">
      <Paragraph>{article.article_text}</Paragraph>
    </TabPane>
    <TabPane tab="Brocardi" key="2">
      <Paragraph>{article.brocardi_info.Brocardi}</Paragraph>
    </TabPane>
    <TabPane tab="Ratio" key="3">
      <Paragraph>{article.brocardi_info.Ratio}</Paragraph>
    </TabPane>
    <TabPane tab="Spiegazione" key="4">
      <Paragraph>{article.brocardi_info.Spiegazione}</Paragraph>
    </TabPane>
  </Tabs>
);

export default DynamicTab;
