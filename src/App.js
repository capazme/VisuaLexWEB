// src/App.js
import React, { useState } from 'react';
import { Layout, Typography, Button } from 'antd';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import SearchForm from './components/SearchForm/SearchForm';
import NormList from './components/NormList/NormList';
import { fetchAllData } from './api/fetchAllData';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Stato per apertura della finestra
  const [isDragging, setIsDragging] = useState(false); // Stato per identificare il trascinamento

  const [position, setPosition] = useState({ x: 100, y: 100 });

  const handleSearch = async (data) => {
    try {
      const result = await fetchAllData(data);
      if (!result.error) {
        setResults(result);
        console.log('Ricerca completata con successo!');
      } else {
        console.error(result.error);
        console.error('Errore durante la ricerca.');
      }
    } catch (error) {
      console.error('Errore durante la ricerca:', error);
    }
  };

  const handleToggle = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
      console.log('Form toggle, isOpen:', !isOpen);
    }
  };

  const [{ x, y }, api] = useSpring(() => ({
    x: position.x,
    y: position.y,
    config: { tension: 500, friction: 30 },
  }));

  const bind = useDrag(
    ({ active, movement: [mx, my], event, memo = position }) => {
      event.stopPropagation(); // Previene l’attivazione del clic
      setIsDragging(active); // Attiva il trascinamento

      if (active) {
        api.start({ x: memo.x + mx, y: memo.y + my });
        console.log('Dragging, position:', { x: memo.x + mx, y: memo.y + my });
      } else {
        setPosition({ x: memo.x + mx, y: memo.y + my });
        console.log('Drag end, final position:', { x: memo.x + mx, y: memo.y + my });
      }
      return memo;
    },
    { filterTaps: true } // Ignora piccoli movimenti come tap
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#fff', padding: '1em' }}>
        <Title level={3} style={{ margin: 0 }}>
          VisuaLex - Ricerca Norme
        </Title>
      </Header>
      <Content style={{ padding: '2em' }}>
        <NormList data={results} />
      </Content>

      {/* Pallina fluttuante */}
      <animated.div
        {...bind()}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x,
          y,
          zIndex: 1500,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#1890ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={handleToggle}
      >
        🔍
      </animated.div>

      {/* Finestra di ricerca */}
      {isOpen && !isDragging && (
        <animated.div
          style={{
            position: 'fixed',
            top: position.y + 60,
            left: position.x,
            zIndex: 1500,
            width: '300px',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5} style={{ margin: 0 }}>
              Ricerca Norme
            </Title>
            <Button type="text" onClick={() => setIsOpen(false)}>
              Chiudi
            </Button>
          </div>
          <SearchForm onSearch={handleSearch} />
        </animated.div>
      )}
    </Layout>
  );
};

export default App;
