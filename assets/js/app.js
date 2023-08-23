// // Importez la bibliothèque js-cookie
// import 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/src/js.cookie.mjs';

//state
let currCity = 'London';
let units = 'metric';

//Selectors
let city = document.querySelector('.weather__city');
let datetime = document.querySelector('.weather__datetime');
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector('.weather__temperature');
let weather__icon = document.querySelector('.weather__icon');
let weather__minmax = document.querySelector('.weather__minmax');
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');

//search
document.querySelector('.weather__search').addEventListener('submit', e => {
    let search = document.querySelector('.weather__searchform');
    //prevent default action
    e.preventDefault();
    //change current city
    currCity = search.value;
    //get weather forecast
    getWeather();
    //clear form
    search.value = ""
})

//units
document.querySelector('.weather_unit_celsius').addEventListener('click', () => {
    if(units !== 'metric'){
    //change to metric
    units = "metric"
    //get weather forecast
    getWeather();
    }
})

document.querySelector('.weather_unit_farenheit').addEventListener('click', () => {
    if(units !== 'imperial'){
    //change to imperial
    units = "imperial"
    //get weather forecast
    getWeather();
    }
})

// // Fonction pour ajouter une ville aux favoris
// function addToFavorites(city) {
//     // Vérifiez si la ville est déjà dans les favoris
//     const favorites = Cookies.getJSON('favorites') || [];
//     if (!favorites.includes(city)) {
//        favorites.push(city);
//        Cookies.set('favorites', favorites);
//     }
//  }

// // Fonction pour supprimer une ville des favoris
// function removeFromFavorites(city) {
//     // Récupérez la liste des favoris
//     const favorites = Cookies.getJSON('favorites') || [];
//     // Supprimez la ville de la liste
//     const index = favorites.indexOf(city);
//     if (index !== -1) {
//        favorites.splice(index, 1);
//        Cookies.set('favorites', favorites);
//     }
//  }

// // Fonction pour afficher les villes favorites
// function displayFavorites() {
//     const favoritesList = document.querySelector('.favorites-list');
//     // Récupérez la liste des favoris depuis les cookies
//     const favorites = Cookies.getJSON('favorites') || [];
//     // Affichez les favoris dans l'interface utilisateur
//     favoritesList.innerHTML = '';
//     favorites.forEach(city => {
//        const listItem = document.createElement('li');
//        listItem.textContent = city;
//        // Ajoutez un bouton pour supprimer la ville des favoris
//        const removeButton = document.createElement('button');
//        removeButton.textContent = 'Supprimer des favoris';
//        removeButton.addEventListener('click', () => {
//           removeFromFavorites(city);
//           displayFavorites();
//        });
//        listItem.appendChild(removeButton);
//        favoritesList.appendChild(listItem);
//     });
//  }

//  // Exemple d'utilisation pour ajouter une ville aux favoris
// document.querySelector('.add-to-favorites-button').addEventListener('click', () => {
//     const cityName = currCity; // Utilisez la ville actuelle comme exemple
//     addToFavorites(cityName);
//     displayFavorites();
//  });
 
// // Exemple d'utilisation pour afficher les villes favorites au chargement de la page
// document.addEventListener('DOMContentLoaded', () => {
//     displayFavorites();
//  });

function convertTimeStamp(timestamp, timezone){
    const convertTimezone = timezone / 3600;//convert second to hour

    const date = new Date(timestamp * 1000);//convert second to millisecond

    const options = {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-": "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    }
    return date.toLocaleString("en-US", options);
}

//convert country code to name
function convertCountryCode(country) {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(country);
}


function getWeather() {
    const API_KEY = '01ed09787471c3c54b3e051988071182';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Vérifiez les données dans la console
            city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
            datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
            weather__forecast.innerHTML = `<p>${data.weather[0].main}`;
            weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`
            weather__icon.innerHTML = `<img src="http://openweathermap.com/img/wn/${data.weather[0].icon}@4x.png" alt="">`
            weather__minmax.innerHTML = `<p>Min ${data.main.temp_min.toFixed()}&#176</p><p>Max ${data.main.temp_max.toFixed()}&#176</p>`
            weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
            weather__humidity.innerHTML = `${data.main.humidity}%`
            weather__wind.innerHTML = `${data.wind.speed}${units === "imperial" ? " mph":" m/s"}`
            weather__pressure.innerHTML = `${data.main.pressure} hpa`

            const weatherDescription = data.weather[0].main.toLowerCase();

            //sélectionner l'élément .weather__icon
            const weatherIcon = document.querySelector('.weather__icon img');

            //condition pour choisir l'image en fonction de la desciption météo
            if (weatherDescription.includes('rain')) {
                weatherIcon.src = 'assets/img/rainy.gif';
            } else if (weatherDescription.includes('sunny')) {
                weatherIcon.src = 'assets/img/sunny.gif';
            } else {
                //par défaut afficher une autre image si la description n'est pas reconnue
                weatherIcon.src = 'assets/img/clouds.gif';
            }
        })
        .catch(error => {
            console.error("Une erreur s'est produite lors de la récupération des données météorologiques :", error);
        });


}




document.addEventListener('DOMContentLoaded', getWeather)