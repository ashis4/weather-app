const apiKey = "01d37be6607a48ce837131819261701";


function getWeather() {
    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (data.error) {
                alert(data.error.message);
                return;
            }

            document.getElementById("cityName").innerText = data.location.name;
            document.getElementById("temperature").innerText = data.current.temp_c + "°C";
            document.getElementById("description").innerText = data.current.condition.text;
            document.getElementById("humidity").innerText = data.current.humidity;
            document.getElementById("wind").innerText = data.current.wind_kph;
        })
        .catch(error => {
            alert("Network error");
            console.log(error);
        });
}

const cityInput = document.getElementById("cityInput");
const cityList = document.getElementById("cityList");

cityInput.addEventListener("input", function () {
    const query = cityInput.value.trim();

    if (query.length < 2) return;

    fetch(`https://api.teleport.org/api/cities/?search=${query}&limit=15`)
        .then(response => response.json())
        .then(data => {
            cityList.innerHTML = "";

            const results = data._embedded["city:search-results"];

            let indianCities = results.filter(city =>
                city.matching_full_name.includes("India")
            );

            let exactMatches = indianCities.filter(city =>
                city.matching_full_name
                    .toLowerCase()
                    .startsWith(query.toLowerCase() + ",")
            );
            let maharashtraCities = indianCities.filter(city =>
                city.matching_full_name.includes("Maharashtra")
            );

            let finalCities = exactMatches.length > 0
                ? exactMatches
                : maharashtraCities.length > 0
                ? maharashtraCities
                : indianCities;

            finalCities.slice(0, 5).forEach(city => {
                const option = document.createElement("option");
                option.value = city.matching_full_name
                    .replace(", Maharashtra, India", "")
                    .replace(", India", "");
                cityList.appendChild(option);
            });
        });
});

