// src/components/NormList/NormList.js
import React from 'react';
import { List, Card, Typography, Divider } from 'antd';

const { Title, Text } = Typography;

const NormList = ({ data }) => {
  return (
    <div style={{ marginTop: 24 }}>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <Card title={`Articolo: ${item.norma_data.numero_articolo}`}>
              <Text strong>Testo:</Text>
              <p>{item.article_text || 'Non disponibile'}</p>
              {item.brocardi_info && (
                <>
                  <Divider />
                  <Title level={5}>Informazioni Brocardi</Title>
                  <Text>Ratio: {item.brocardi_info.Ratio || 'N/A'}</Text><br />
                  <Text>Brocardi: {item.brocardi_info.Brocardi || 'N/A'}</Text><br />
                  <Text>Spiegazione: {item.brocardi_info.Spiegazione || 'N/A'}</Text><br />
                  <Text>Massime: {item.brocardi_info.Massime || 'N/A'}</Text><br />
                  {item.brocardi_info.link && (
                    <a href={item.brocardi_info.link} target="_blank" rel="noopener noreferrer">
                      Visualizza su Normattiva
                    </a>
                  )}
                </>
              )}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default NormList;
