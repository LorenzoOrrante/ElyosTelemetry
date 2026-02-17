import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapUpdater = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position && position.length === 2) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return null;
};

export default MapUpdater;
