import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { Button, Typography } from 'antd';
import SearchForm from '../SearchForm/SearchForm';
import './FloatingSearchBall.styles.css'; // Centralized styles

const { Title } = Typography;

const BALL_SIZE = 50; // px
const FORM_WIDTH = 320; // px
const FORM_HEIGHT = 400; // px

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const FloatingSearchBall = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const ballRef = useRef(null);
  const formRef = useRef(null);

  // Load initial position from localStorage or default
  const getInitialPosition = () => {
    const savedPosition = JSON.parse(localStorage.getItem('floatingBallPosition')) || { x: 100, y: 100 };
    return {
      x: clamp(savedPosition.x, 0, window.innerWidth - BALL_SIZE),
      y: clamp(savedPosition.y, 0, window.innerHeight - BALL_SIZE),
    };
  };

  const [position, setPosition] = useState(getInitialPosition);

  const updatePositionInStorage = (newPosition) => {
    localStorage.setItem('floatingBallPosition', JSON.stringify(newPosition));
  };

  // Update window size on resize
  const handleResize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    setPosition((prev) => {
      const clampedPosition = {
        x: clamp(prev.x, 0, window.innerWidth - BALL_SIZE),
        y: clamp(prev.y, 0, window.innerHeight - BALL_SIZE),
      };
      updatePositionInStorage(clampedPosition);
      return clampedPosition;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Calculate bounds for dragging
  const bounds = useMemo(() => ({
    minX: 0,
    minY: 0,
    maxX: windowSize.width - BALL_SIZE,
    maxY: windowSize.height - BALL_SIZE,
  }), [windowSize]);

  // Animations with react-spring
  const [{ x, y }, api] = useSpring(() => ({
    x: position.x,
    y: position.y,
    config: { tension: 500, friction: 30 },
  }));

  // Drag handler
  const bind = useDrag(
    ({ active, movement: [mx, my], memo = position }) => {
      setIsDragging(active);
      if (active) {
        const newPosition = {
          x: clamp(memo.x + mx, bounds.minX, bounds.maxX),
          y: clamp(memo.y + my, bounds.minY, bounds.maxY),
        };
        api.start(newPosition);
        return memo;
      }
      const finalPosition = {
        x: clamp(memo.x + mx, bounds.minX, bounds.maxX),
        y: clamp(memo.y + my, bounds.minY, bounds.maxY),
      };
      setPosition(finalPosition);
      updatePositionInStorage(finalPosition);
      return finalPosition;
    },
    { filterTaps: true }
  );

  const toggleForm = () => {
    if (!isDragging) setIsOpen((prev) => !prev);
  };

  const getFormPosition = useMemo(() => {
    let formX = position.x;
    let formY = position.y + BALL_SIZE + 10;

    if (formX + FORM_WIDTH > windowSize.width) {
      formX = windowSize.width - FORM_WIDTH - 10;
    }

    if (formY + FORM_HEIGHT > windowSize.height) {
      formY = position.y - FORM_HEIGHT - 10;
      if (formY < 0) {
        formY = windowSize.height - FORM_HEIGHT - 10;
      }
    }

    return { formX, formY };
  }, [position, windowSize]);

  return (
    <>
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
          width: BALL_SIZE,
          height: BALL_SIZE,
          borderRadius: '50%',
          backgroundColor: '#1890ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'pointer',
          userSelect: 'none',
          fontSize: '25px',
          touchAction: 'none',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        onClick={toggleForm}
        aria-label="Toggle Search Form"
        role="button"
        tabIndex={0}
      >
        🔍
      </animated.div>

      {isOpen && !isDragging && (
        <animated.div
          ref={formRef}
          style={{
            position: 'fixed',
            top: getFormPosition.formY,
            left: getFormPosition.formX,
            zIndex: 1000,
            width: FORM_WIDTH,
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#fff',
            maxHeight: windowSize.height - getFormPosition.formY - 20,
            overflowY: 'auto',
          }}
        >
          <div className="search-form-header">
            <Title level={5} style={{ margin: 0 }}>
              Ricerca Norme
            </Title>
            <Button
              type="text"
              onClick={() => setIsOpen(false)}
              aria-label="Close Search Form"
            >
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
