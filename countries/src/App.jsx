import { useState } from "react";
import axios from "axios";

const api_key = import.meta.env.VITE_API_KEY;

const Country = ({ country, weatherData }) => {
  if (!weatherData) {
    return null;
  }
  const imgSrc = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>
        capital {country.capital}
        <br />
        area {country.area}
      </p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} />
      <h3>Weather in {country.capital}</h3>
      <p>temperature {weatherData ? weatherData.main.temp : ""} Celcius</p>
      <img src={imgSrc} />
      <p>wind {weatherData.wind.speed} m/s</p>
    </div>
  );
};

const Countries = ({ foundCountries, completeCountryName, weatherData }) => {
  if (foundCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (foundCountries.length === 0) {
    return <p>No matches</p>;
  } else if (foundCountries.length === 1) {
    return <Country country={foundCountries[0]} weatherData={weatherData} />;
  }

  return (
    <ul>
      {foundCountries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}{" "}
          <button onClick={() => completeCountryName(country.name.common)}>
            show
          </button>
        </li>
      ))}
    </ul>
  );
};

function App() {
  const [inputValue, setInputValue] = useState("");
  const [foundCountries, setFoundCountries] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);

    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        const searchResults = response.data.filter((country) =>
          country.name.common
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        );
        setFoundCountries(searchResults);
        if (searchResults.length === 1) {
          getWeatherData(searchResults);
        }
      });
  };

  const getWeatherData = (searchResults) => {
    if (
      weatherData === null ||
      weatherData.name !== searchResults[0].capital[0]
    ) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchResults[0].capital[0]}&appid=${api_key}&units=metric`
        )
        .then((response) => {
          setWeatherData(response.data);
        });
    }
  };

  const completeCountryName = (countryName) => {
    setInputValue(countryName);
    axios
      .get(
        `https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`
      )
      .then((result) => {
        setFoundCountries([result.data]);
        getWeatherData([result.data]);
      });
  };

  return (
    <div>
      <form>
        find countries <input value={inputValue} onChange={handleInputChange} />
      </form>
      <Countries
        foundCountries={foundCountries}
        completeCountryName={completeCountryName}
        weatherData={weatherData}
      />
    </div>
  );
}

export default App;
