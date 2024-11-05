// src/components/FloatingSearchButton.js
import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import SearchForm from './SearchForm';

const { Title } = Typography;

const FloatingSearchButton = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false); // Stato per apertura della finestra
  const [isDragging, setIsDragging] = useState(false); // Stato per identificare il trascinamento
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [{ x, y }, api] = useSpring(() => ({ x: position.x, y: position.y, config: { tension: 500, friction: 30 } }));

  const handleToggle = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
      console.log('Form toggle, isOpen:', !isOpen);
    }
  };

  const bind = useDrag(
    ({ active, movement: [mx, my], event, memo = position }) => {
      event.stopPropagation();
      setIsDragging(active);
      if (active) {
        api.start({ x: memo.x + mx, y: memo.y + my });
        console.log('Dragging, position:', { x: memo.x + mx, y: memo.y + my });
      } else {
        setPosition({ x: memo.x + mx, y: memo.y + my });
        console.log('Drag end, final position:', { x: memo.x + mx, y: memo.y + my });
      }
      return memo;
    },
    { filterTaps: true }
  );

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
          touchAction: 'none'
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
            zIndex: 1000,
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
              X
            </Button>
          </div>
          <SearchForm onSearch={onSearch} />
        </animated.div>
      )}
    </>
  );
};

export default FloatingSearchButton;
