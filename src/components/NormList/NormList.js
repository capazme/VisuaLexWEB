// src/components/NormList/NormList.js

import React, { useState, useEffect, useRef } from 'react';
import { Layout, Modal, Typography, message } from 'antd';
import { motion } from 'framer-motion';
import FloatingBall from '../FloatingBalls/FloatingBall';
import './NormList.styles.css';

const NormaList = ({ data }) => {
  const [floatingBalls, setFloatingBalls] = useState({});
  const [isDeleteZoneHover, setIsDeleteZoneHover] = useState(false);
  const [isDeleteZoneActive, setIsDeleteZoneActive] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
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

  const handleDropInDeleteZone = (key) => {
    console.log(`Dropping ball with key ${key} into delete zone.`);
    setDeleteCandidate(key);
  };

  const confirmDelete = () => {
    const updatedBalls = { ...floatingBalls };
    delete updatedBalls[deleteCandidate];
    setFloatingBalls(updatedBalls);
    setDeleteCandidate(null);
    message.success('Norma eliminata con successo.');
  };

  return (
    <Layout style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {Object.entries(floatingBalls).map(([key, ballData]) => (
          <FloatingBall
            key={key}
            info={ballData.info}
            articles={ballData.articles}
            onDrop={() => handleDropInDeleteZone(key)}
            setIsDeleteZoneActive={setIsDeleteZoneActive}
            deleteZoneRef={deleteZoneRef}
          />
        ))}
      </div>

      {/* Area di eliminazione su tutto il bordo inferiore */}
      <motion.div
        ref={deleteZoneRef}
        className={`delete-zone ${isDeleteZoneActive ? 'active' : isDeleteZoneHover ? 'hover' : ''}`}
        onDragOver={(e) => {
          setIsDeleteZoneHover(true);
          e.preventDefault(); // Permette al drop di avvenire
        }}
        onDragLeave={() => setIsDeleteZoneHover(false)}
        onDrop={() => setIsDeleteZoneHover(false)}
        animate={{
          background: isDeleteZoneActive
            ? 'linear-gradient(180deg, rgba(255,0,0,1), rgba(255,0,0,0))'
            : isDeleteZoneHover
            ? 'linear-gradient(180deg, rgba(255,69,0,0.8), rgba(255,69,0,0))'
            : 'linear-gradient(180deg, rgba(255,0,0,0.5), rgba(255,0,0,0))',
        }}
        transition={{ duration: 0.3 }}
      >
        <Typography.Title level={5} style={{ color: '#fff' }}>
          Trascina qui per eliminare
        </Typography.Title>
      </motion.div>

      {/* Modal di conferma eliminazione */}
      <Modal
        title="Conferma Eliminazione"
        open={!!deleteCandidate}
        onOk={confirmDelete}
        onCancel={() => setDeleteCandidate(null)}
        okText="Conferma"
        cancelText="Annulla"
      >
        <p>Sei sicuro di voler eliminare questa norma?</p>
      </Modal>
    </Layout>
  );
};

export default NormaList;
