import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesColorType = {
  cases: {
    hex: '#cc1034',
    rgb: 'rgb(204,16,52)',
    half_op: 'rgba(204,16,52,0.5)',
    multiplier: 80000,
  },
  recovered: {
    hex: '#7dd71d',
    rgb: 'rgb(125,215,29)',
    half_op: 'rgba(125,215,29,0.5)',
    multiplier: 120000,
  },
  deaths: {
    hex: '#fb4443',
    rgb: 'rgb(251,68,67)',
    half_op: 'rgba(204,16,52,0.5)',
    multiplier: 80000,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  return sortedData.sort((firstCountry, secondCountry) =>
    firstCountry.cases > secondCountry.cases ? -1 : 1
  );
};

export const showDataOnMap = (data, caseType = 'cases') =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesColorType[caseType].hex}
      fillColor={casesColorType[caseType].half_op}
      radius={Math.sqrt(
        country[caseType] * casesColorType[caseType].multiplier
      )}
    >
      <Popup>
        <div className='info-container'>
          <div
            className='info-flag'
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className='info-name'>{country.country}</div>
          <div className='info-confirmed'>
            Cases:{numeral(country.cases).format('0,0')}
          </div>
          <div className='info-recovered'>
            Recovered:{numeral(country.recovered).format('0,0')}
          </div>
          <div className='info-deaths'>
            Deaths:{numeral(country.deaths).format('0,0')}
          </div>
          <div>Sagar Bhatia</div>
        </div>
      </Popup>
    </Circle>
  ));

export const formatNumbers = (stats) =>
  stats ? `+${numeral(stats).format('0.0a')}` : '+0';
