document.getElementById("weatherButton").addEventListener("click", function () {
    const city = document.getElementById("cityInput").value;

    if (!city) {
        alert("Wpisz nazwę miasta!");
        return;
    }

    const apiKey = "5cbced53c024fc89419c1baf9c29dc43";

    // Current Weather API za pomocą XMLHttpRequest
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", currentWeatherUrl, true);
    
    // Log przed wysłaniem żądania
    console.log("Wysyłanie żądania do Current Weather API:", currentWeatherUrl);
    
    xhr.onload = function () {
        console.log("Status odpowiedzi:", xhr.status);
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log("Otrzymane dane z Current Weather API:", data);
    
            const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            document.getElementById("currentWeatherData").innerHTML = `
                <i class="fas fa-thermometer-half"></i> Temperatura: ${data.main.temp}°C <br>
                <i class="fas fa-tint"></i> Wilgotność: ${data.main.humidity}% <br>
                <i class="fas fa-cloud"></i> Opis: ${data.weather[0].description} <br>
                <img src="${icon}" alt="Ikona pogody">
            `;
        } else {
            console.error("Błąd w odpowiedzi z Current Weather API:", xhr.status, xhr.statusText);
            document.getElementById("currentWeatherData").innerText = "Nie udało się pobrać danych.";
        }
    };
    
    // Log w przypadku błędu
    xhr.onerror = function () {
        console.error("Błąd sieci podczas wysyłania żądania do Current Weather API.");
    };
    
    xhr.send();

    // 5 Day Forecast API za pomocą Fetch API
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    fetch(forecastWeatherUrl)
    .then(response => {
        console.log("Otrzymano odpowiedź z API Forecast:", response); // Log odpowiedzi HTTP
        if (!response.ok) {
            throw new Error("Nie udało się pobrać danych.");
        }
        return response.json();
    })
    .then(data => {
        console.log("Forecast Weather JSON Data:", data); // Log pełnej odpowiedzi JSON

        const forecastList = document.getElementById("forecastWeatherData");
        forecastList.innerHTML = "";

        // Grupowanie prognoz wg dni
        const groupedForecasts = {};
        data.list.forEach(entry => {
            const date = entry.dt_txt.split(" ")[0]; 
            if (!groupedForecasts[date]) {
                groupedForecasts[date] = [];
            }
            groupedForecasts[date].push(entry);
        });

        console.log("Grouped Forecasts by Date:", groupedForecasts); // Log zgrupowanych prognoz

        // Wyświetlenie danych
        for (const [date, entries] of Object.entries(groupedForecasts)) {
            console.log(`Prognozy dla daty: ${date}`, entries); // Log szczegółów dla każdego dnia

            const dateItem = document.createElement("li");
            dateItem.innerHTML = `<strong><i class="fas fa-calendar-day"></i> Data: ${date}</strong>`;
            forecastList.appendChild(dateItem);

            entries.forEach(entry => {
                const time = entry.dt_txt.split(" ")[1]; 
                const icon = `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`;

                console.log(`Godzina: ${time}, Temperatura: ${entry.main.temp}°C, Opis: ${entry.weather[0].description}`); // Log szczegółów wpisu

                const detailItem = document.createElement("li");
                detailItem.style.marginLeft = "20px";
                detailItem.innerHTML = `
                    <i class="fas fa-clock"></i> Godzina: ${time} <br>
                    <i class="fas fa-thermometer-half"></i> Temperatura: ${entry.main.temp}°C <br>
                    <i class="fas fa-cloud"></i> Opis: ${entry.weather[0].description} <br>
                    <img src="${icon}" alt="Ikona pogody">
                `;
                forecastList.appendChild(detailItem);
            });
        }
    })
    .catch(error => {
        console.error("Błąd w Fetch API Forecast:", error); // Log błędu
        document.getElementById("forecastWeatherData").innerHTML = "<li>Nie udało się pobrać danych.</li>";
    });

});
