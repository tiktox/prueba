import React, { useEffect, useState } from 'react';
import Pin, { PinProps } from './Pin';

interface PinGridProps {
  pins: PinProps[];
}

const PinGrid: React.FC<PinGridProps> = ({ pins }) => {
  const [columnCount, setColumnCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumnCount(2);
      } else if (window.innerWidth < 768) {
        setColumnCount(3);
      } else if (window.innerWidth < 1024) {
        setColumnCount(4);
      } else {
        setColumnCount(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Distribute pins across columns in a masonry layout
  const distributeColumnsEvenly = () => {
    const columnsArray: PinProps[][] = Array.from({ length: columnCount }, () => []);
    
    pins.forEach((pin, index) => {
      columnsArray[index % columnCount].push(pin);
    });
    
    return columnsArray;
  };
  
  const columnGroups = distributeColumnsEvenly();
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {columnGroups.map((columnPins, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4">
          {columnPins.map((pin) => (
            <Pin key={pin.id} {...pin} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PinGrid;