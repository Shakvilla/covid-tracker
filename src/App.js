import React, { useState, useEffect } from 'react'
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import InfoCard from './InfoCard';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './helper';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from 'numeral';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')


  //https://disease.sh/v3/covid-19/countries

  useEffect(() => {

    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));

          const sortedData = sortData(data);
          setTableData(sortedData)
          setMapCountries(data);
          setCountries(countries)
        });
    };

    getCountriesData();

  }, []);

  const countryChangeHandler = async (e) => {
    const countryCode = e.target.value
    setCountry(countryCode);


    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])

          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);

      });
  };

  // console.log("COUNTRY INFO >>>", countryInfo)


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 className="app__title"> COVID TRACKER</h1>


          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={countryChangeHandler}>
              <MenuItem value="worldwide"> World Wide  </MenuItem>


              {
                countries.map((country, index) => (
                  <MenuItem value={country.value} key={index}> {country.name}  </MenuItem>

                ))
              }




            </Select>

          </FormControl>
        </div>

        <div className="app__stats">

          <InfoCard
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}

          />
          <InfoCard
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}

            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}

          />
          <InfoCard
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}

          />

        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}

        />


      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <div>
            <LineGraph className="app__graph" casesType={casesType} />
          </div>
        </CardContent>

      </Card>
    </div>
  );
}

export default App;
