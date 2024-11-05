import React, { useState, useEffect, useRef } from 'react';
import { Layout, Typography, message } from 'antd';
import FloatingBall from '../FloatingBalls/FloatingBall';
import './NormList.styles.css';

const NormaList = ({ data }) => {
  const [floatingBalls, setFloatingBalls] = useState({});
  const [isDeleteZoneActive, setIsDeleteZoneActive] = useState(false);
  const deleteZoneRef = useRef(null);

  useEffect(() => {
    const updatedBalls = {};
    data.forEach((doc) => {
      if (doc.info) {
        const { tipo_atto, data: dataNorma, numero_atto } = doc.info;
        const uniqueKey = `${tipo_atto}-${dataNorma || 'null'}-${numero_atto || 'null'}`;

        if (updatedBalls[uniqueKey]) {
          updatedBalls[uniqueKey].articles.push(...doc.articles);
        } else {
          updatedBalls[uniqueKey] = {
            info: doc.info,
            articles: doc.articles,
          };
        }
      }
    });
    setFloatingBalls(updatedBalls);
  }, [data]);

  const handleDrop = (key) => {
    const updatedBalls = { ...floatingBalls };
    delete updatedBalls[key];
    setFloatingBalls(updatedBalls);
    message.success('Norma eliminata con successo.');
    setIsDeleteZoneActive(false);
  };

  return (
    <Layout style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {Object.entries(floatingBalls).map(([key, ballData]) => (
          <FloatingBall
            key={key}
            info={ballData.info}
            articles={ballData.articles}
            onDrop={() => handleDrop(key)}
            setIsDeleteZoneActive={setIsDeleteZoneActive}
            deleteZoneRef={deleteZoneRef}
          />
        ))}
      </div>

      {/* Area di eliminazione come cerchio rosso */}
      <div
        ref={deleteZoneRef}
        className={`delete-zone ${isDeleteZoneActive ? 'active' : ''}`}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: isDeleteZoneActive ? '#f5222d' : '#ff4d4f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Elimina
      </div>
    </Layout>
  );
};

export default NormaList;
