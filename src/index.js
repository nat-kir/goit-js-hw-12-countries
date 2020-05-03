import './styles.css';
import countriesListTpl from './templates/countries-list.hbs';
import countryTpl from './templates/selected-country.hbs';
import PNotify from 'pnotify/dist/es/PNotify.js';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons.js';
import 'pnotify/dist/PNotifyBrightTheme.css';
import debounce from 'lodash.debounce';

const inputRef = document.querySelector('.input');
const countryInfoRef = document.querySelector('.country_info');
const countriesListRef = document.querySelector('.countries-list');

inputRef.addEventListener('input', debounce(inputHandler, 500));

function inputHandler(e) {
  const inputValue = e.target.value;
  const url = `https://restcountries.eu/rest/v2/name/${inputValue}`;
  cleanResult();
  fetch(url)
    .then(response => CheckError(response))
    .then(countries => fetchResultDisplay(countries))
    .catch(error => console.log(error));
  e.target.value = '';
}

function fetchResultDisplay(countries) {
  if (countries.length > 10) {
    return PNotify.error({
      text: 'Too many matches found. Please enter a more specific query.',
    });
  }
  if ((countries.length < 11) & (countries.length > 1)) {
    const markup = countriesListTpl(countries);
    return countriesListRef.insertAdjacentHTML('beforeend', markup);
  }
  if ((countries.length = 1)) {
    const markup = countryTpl(countries);
    return countryInfoRef.insertAdjacentHTML('beforeend', markup);
  }
}

function CheckError(response) {
  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  } else {
    cleanResult();
    PNotify.alert({
      text: 'You have entered invalid value. Try again',
    });
  }
}

function cleanResult() {
  countryInfoRef.innerHTML = '';
  countriesListRef.innerHTML = '';
}
