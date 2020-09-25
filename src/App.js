import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core';
import 'leaflet/dist/leaflet.css';

import InfoBox from './components/InfoBox/InfoBox';
import Table from './components/Table/Table';
import Map from './components/Map/Map';
import LineGraph from './components/LineGraph/LineGraph';
import { sortData, formatNumbers } from './util';
import './App.css';

// https://disease.sh/v3/covid-19/all
// https//disease.sh/v3/covid-19/countries/

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 19.076, lng: 72.8777 });
  const [zoom, setZoom] = useState(4);
  const [mapCountry, setMapCountry] = useState([]);
  const [caseType, setCaseType] = useState('cases');

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);

          setTableData(sortedData);
          setMapCountry(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19 TRACKER</h1>
          <h2 className='personal__name'>𝖘𝖆𝖌𝖆𝖗 𝖇𝖍𝖆𝖙𝖎𝖆</h2>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide'>WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={Math.random()} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='app__stats'>
          <InfoBox
            isRed
            active={caseType === 'cases'}
            onClick={(e) => setCaseType('cases')}
            title='Coronavirus Cases'
            cases={formatNumbers(countryInfo.todayCases)}
            total={formatNumbers(countryInfo.cases)}
          />
          <InfoBox
            active={caseType === 'recovered'}
            onClick={(e) => setCaseType('recovered')}
            title='Recovered'
            cases={formatNumbers(countryInfo.todayRecovered)}
            total={formatNumbers(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={caseType === 'deaths'}
            onClick={(e) => setCaseType('deaths')}
            title='Deaths'
            cases={formatNumbers(countryInfo.todayDeaths)}
            total={formatNumbers(countryInfo.deaths)}
          />
        </div>
        <Map
          caseType={caseType}
          center={mapCenter}
          zoom={zoom}
          country={mapCountry}
        />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h2>Live Cases by Country</h2>
          <Table countries={tableData} />
          <h2 className='app__graphTitle'>WorldWide new {caseType}</h2>
          <LineGraph casesType={caseType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
