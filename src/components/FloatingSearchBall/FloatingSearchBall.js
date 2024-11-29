import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { Button, Typography } from 'antd';
import SearchForm from '../SearchForm/SearchForm'; // Importa il tuo modulo di ricerca

const { Title } = Typography;

// Definisci clamp fuori dal componente
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Dimensioni della pallina fluttuante e del form
const BALL_SIZE = 50; // in px
const FORM_WIDTH = 320; // in px
const FORM_HEIGHT = 400; // approssimazione, potrebbe variare

const FloatingSearchBall = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false); // Stato per apertura del form
  const [isDragging, setIsDragging] = useState(false); // Stato per il trascinamento
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  }); // Dimensioni della finestra

  const ballRef = useRef(null);
  const formRef = useRef(null);

  // Recupera la posizione salvata da localStorage o usa valori predefiniti
  const getInitialPosition = () => {
    const savedPosition = JSON.parse(localStorage.getItem('floatingBallPosition'));
    if (savedPosition) {
      // Assicurati che la posizione salvata sia entro i limiti della finestra attuale
      const maxX = window.innerWidth - BALL_SIZE;
      const maxY = window.innerHeight - BALL_SIZE;
      return {
        x: clamp(savedPosition.x, 0, maxX),
        y: clamp(savedPosition.y, 0, maxY),
      };
    }
    return { x: 100, y: 100 };
  };

  const [position, setPosition] = useState(getInitialPosition);

  // Funzione per aggiornare le dimensioni della finestra
  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    // Verifica e correggi la posizione se necessario
    setPosition((prev) => {
      const maxX = window.innerWidth - BALL_SIZE;
      const maxY = window.innerHeight - BALL_SIZE;
      const newX = clamp(prev.x, 0, maxX);
      const newY = clamp(prev.y, 0, maxY);
      const updated = { x: newX, y: newY };
      localStorage.setItem('floatingBallPosition', JSON.stringify(updated));
      return updated;
    });
  }, []); // Nessuna dipendenza necessaria

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // Pulizia dell'evento
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Calcola i limiti di trascinamento per la pallina
  const getBounds = () => {
    const maxX = windowSize.width - BALL_SIZE;
    const maxY = windowSize.height - BALL_SIZE;
    return { minX: 0, minY: 0, maxX, maxY };
  };

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
        const newX = clamp(memo.x + mx, getBounds().minX, getBounds().maxX);
        const newY = clamp(memo.y + my, getBounds().minY, getBounds().maxY);
        api.start({ x: newX, y: newY });
      } else {
        const finalX = clamp(memo.x + mx, getBounds().minX, getBounds().maxX);
        const finalY = clamp(memo.y + my, getBounds().minY, getBounds().maxY);
        setPosition({ x: finalX, y: finalY });
        localStorage.setItem('floatingBallPosition', JSON.stringify({ x: finalX, y: finalY }));
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

  // Calcola la posizione del form per evitare che esca dai bordi
  const getFormPosition = () => {
    let formX = position.x;
    let formY = position.y + BALL_SIZE + 10; // 10px di margine

    // Verifica se il form esce dai bordi orizzontali
    if (formX + FORM_WIDTH > windowSize.width) {
      formX = windowSize.width - FORM_WIDTH - 10; // 10px di padding
    }

    // Verifica se il form esce dai bordi verticali
    if (formY + FORM_HEIGHT > windowSize.height) {
      formY = position.y - FORM_HEIGHT - 10; // Posiziona sopra la pallina
      if (formY < 0) {
        formY = windowSize.height - FORM_HEIGHT - 10; // Ultimo tentativo
      }
    }

    return { formX, formY };
  };

  const { formX, formY } = isOpen ? getFormPosition() : { formX: 0, formY: 0 };

  return (
    <>
      {/* Pallina fluttuante */}
      <animated.div
        {...bind()}
        ref={ballRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x,
          y,
          zIndex: 1000,
          width: `${BALL_SIZE}px`,
          height: `${BALL_SIZE}px`,
          borderRadius: '50%',
          backgroundColor: '#1890ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          fontSize: '25px',
          touchAction: 'none',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        onClick={toggleForm}
        aria-label="Apri form di ricerca"
      >
        🔍
      </animated.div>

      {/* Modulo di ricerca */}
      {isOpen && !isDragging && (
        <animated.div
          ref={formRef}
          style={{
            position: 'fixed',
            top: formY,
            left: formX,
            zIndex: 1000,
            width: `${FORM_WIDTH}px`,
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#fff',
            maxHeight: windowSize.height - formY - 20, // 20px di padding inferiore
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              Ricerca Norme
            </Title>
            <Button type="text" onClick={() => setIsOpen(false)} aria-label="Chiudi form di ricerca">
              ✕
            </Button>
          </div>
          <SearchForm onSearch={onSearch} />
        </animated.div>
      )}
    </>
  );
};

export default FloatingSearchBall;
