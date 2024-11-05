// src/components/FloatingBalls/FloatingBall.js

import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import './FloatingBall.styles.css';

const FloatingBall = ({ info, articles, colorMap = {}, onDrop, setIsDeleteZoneActive, deleteZoneRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const [{ x, y }, api] = useSpring(() => ({
    x: position.x,
    y: position.y,
    config: { tension: 100, friction: 20, mass: 1.5 },
  }));

  const bind = useDrag(
    ({ active, movement: [mx, my], event, memo = position }) => {
      event.stopPropagation();
      setIsDragging(active);
      if (active) {
        api.start({ x: memo.x + mx, y: memo.y + my });
        checkIfOverDeleteZone(memo.x + mx, memo.y + my);
      } else {
        setPosition({ x: memo.x + mx, y: memo.y + my });
        checkIfOverDeleteZone(memo.x + mx, memo.y + my, true);
      }
      return memo;
    },
    { filterTaps: true }
  );

  const checkIfOverDeleteZone = (x, y, isDrop = false) => {
    if (deleteZoneRef.current) {
      const deleteZoneRect = deleteZoneRef.current.getBoundingClientRect();
      const isOverDeleteZone =
        x >= deleteZoneRect.left &&
        x <= deleteZoneRect.right &&
        y >= deleteZoneRect.top &&
        y <= deleteZoneRect.bottom;

      setIsDeleteZoneActive(isOverDeleteZone);
      if (isOverDeleteZone && isDrop) onDrop();
    }
  };

  const { tipo_atto, numero_atto, data } = info;
  const actAbbreviation = getActAbbreviation(tipo_atto);
  const actFullText = getFullTextDescription(tipo_atto, numero_atto, data);

  return (
    <animated.div
      {...bind()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        x,
        y,
        backgroundColor: colorMap[tipo_atto?.toLowerCase()] || '#1890ff',
      }}
      className={`floating-ball ${isDragging ? 'dragging' : ''}`}
    >
      <div className="floating-ball__content">{actAbbreviation}</div>
      {(isDragging || isHovered) && (
        <div className="floating-ball__tooltip">{actFullText}</div>
      )}
    </animated.div>
  );
};

// Funzione per abbreviazione
const getActAbbreviation = (type) => {
  const abbreviationMap = {
    "decreto legislativo": "d.lgs.",
    "decreto legge": "d.l.",
    "legge": "legge",
    "costituzione": "cost.",
    "codice civile": "c.c.",
    // Altre abbreviazioni...
  };
  return abbreviationMap[type?.toLowerCase()] || type;
};

// Funzione per testo completo
const getFullTextDescription = (tipo, numero, data) => {
  let description = tipo;
  if (numero) description += ` n. ${numero}`;
  if (data) description += ` del ${data}`;
  return description;
};

export default FloatingBall;
