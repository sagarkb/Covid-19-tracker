import React from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';

import { showDataOnMap } from '../../util';
import './Map.css';

const Map = ({ center, zoom, country, caseType }) => {
  return (
    <div className='map'>
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {showDataOnMap(country, caseType)}
      </LeafletMap>
    </div>
  );
};

export default Map;
