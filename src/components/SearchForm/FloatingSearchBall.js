import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { Button, Typography } from 'antd';
import SearchForm from './SearchForm'; // Importa il tuo modulo di ricerca

const { Title } = Typography;

const FloatingSearchBall = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false); // Stato per apertura del form
  const [isDragging, setIsDragging] = useState(false); // Stato per il trascinamento
  const [position, setPosition] = useState({ x: 100, y: 100 }); // Posizione iniziale della palla

  // Animazioni con react-spring
  const [{ x, y }, api] = useSpring(() => ({
    x: position.x,
    y: position.y,
    config: { tension: 500, friction: 30 },
  }));

  // Gestione trascinamento
  const bind = useDrag(
    ({ active, movement: [mx, my], memo = position }) => {
      setIsDragging(active);
      if (active) {
        api.start({ x: memo.x + mx, y: memo.y + my });
      } else {
        setPosition({ x: memo.x + mx, y: memo.y + my });
      }
      return memo;
    },
    { filterTaps: true }
  );

  // Toggle apertura/chiusura del form
  const toggleForm = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {/* Pallina fluttuante */}
      <animated.div
        {...bind()}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x,
          y,
          zIndex: 1000,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#1890ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          userSelect: 'none',
          fontSize: '25px',
          touchAction: 'none',
        }}
        onClick={toggleForm}
      >
        🔍
      </animated.div>

      {/* Modulo di ricerca */}
      {isOpen && !isDragging && (
        <animated.div
          style={{
            position: 'fixed',
            top: position.y + 60, // Posiziona il form sotto la pallina
            left: position.x,
            zIndex: 1000,
            width: '320px',
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
              X
            </Button>
          </div>
          <SearchForm onSearch={onSearch} />
        </animated.div>
      )}
    </>
  );
};

export default FloatingSearchBall;
