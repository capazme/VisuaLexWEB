import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';

const FloatingBall = ({ info, articles, onDrop, setIsDeleteZoneActive, deleteZoneRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [{ x, y }, api] = useSpring(() => ({ x: position.x, y: position.y, config: { tension: 500, friction: 30 } }));

  const bind = useDrag(
    ({ active, movement: [mx, my], event, memo = position }) => {
      event.stopPropagation();
      setIsDragging(active);
      if (active) {
        api.start({ x: memo.x + mx, y: memo.y + my });
      } else {
        setPosition({ x: memo.x + mx, y: memo.y + my });
        checkIfOverDeleteZone(memo.x + mx, memo.y + my);
      }
      return memo;
    },
    { filterTaps: true }
  );

  const checkIfOverDeleteZone = (x, y) => {
    if (deleteZoneRef.current) {
      const deleteZoneRect = deleteZoneRef.current.getBoundingClientRect();
      const isOverDeleteZone =
        x >= deleteZoneRect.left &&
        x <= deleteZoneRect.right &&
        y >= deleteZoneRect.top &&
        y <= deleteZoneRect.bottom;

      setIsDeleteZoneActive(isOverDeleteZone);
      if (isOverDeleteZone) onDrop();
    }
  };

  return (
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
        color: 'white',
        cursor: 'grab',
        userSelect: 'none',
        fontSize: '18px',
        touchAction: 'none',
      }}
    >
      <div>
        {info.tipo_atto} ({articles.length})
      </div>
    </animated.div>
  );
};

export default FloatingBall;
