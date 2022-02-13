const citiesList = document.querySelector(".cities-list");
const citiesBlock = document.querySelector(".cities-block");
const input = document.querySelector(".input");
const getGeoButton = document.querySelector(".get-geo-button");
const selectButton = document.querySelector(".select-button");
const wrapper = document.querySelector(".wrapper");

const rawList = [];

(async () => {
  const response = await fetch(
    "https://gist.githubusercontent.com/gorborukov/0722a93c35dfba96337b/raw/435b297ac6d90d13a68935e1ec7a69a225969e58/russia"
  );
  const data = await response.json();

  data.forEach((element) => {
    rawList.push(element.city);
  });
  data.sort();
})();

input.addEventListener("keyup", (event) => {
  citiesList.innerHTML = "";

  let actualList = rawList
    .filter((item) => {
      return item.toLowerCase().startsWith(input.value.toLowerCase());
    })
    .slice(0, 5);

  actualList.forEach((e) => {
    let li = document.createElement("div");
    li.textContent = e;
    citiesList.appendChild(li);
  });

  if (citiesList.innerHTML == "" && input != "")
    citiesList.innerHTML = "<div>Нет такого города</div>";
});

citiesList.addEventListener("mousedown", (event) => {
  input.value = event.target.textContent;
});

input.addEventListener("focus", () => {
  citiesBlock.style.display = "block";
});

input.addEventListener("blur", () => {
  citiesBlock.style.display = "none";
});

selectButton.addEventListener("click", (event) => {
  if (input.value == "") {
    alert("Не выбран город");
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `http://api.openweathermap.org/data/2.5/weather?q=${input.value}&lang=ru&units=metric&appid=40c77c0f32a84cfb9ffd5516a4737983`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState != 4) return;

      if (xhr.status != 200) {
        console.warn(xhr.status + ": " + xhr.statusText);
      } else {
        const json = JSON.parse(xhr.responseText);
        createWidget(
          json.name,
          json.main.temp,
          json.weather[0].description,
          json.weather[0].icon
        );
      }
    });
  }
});

getGeoButton.addEventListener("click", (event) => {
  navigator.geolocation.getCurrentPosition(success);
});

function success(pos) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `http://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&lang=ru&units=metric&appid=40c77c0f32a84cfb9ffd5516a4737983`
  );
  xhr.send();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState != 4) return;

    if (xhr.status != 200) {
      console.warn(xhr.status + ": " + xhr.statusText);
    } else {
      const json = JSON.parse(xhr.responseText);
      createWidget(
        json.name,
        json.main.temp,
        json.weather[0].description,
        json.weather[0].icon
      );
    }
  });
}

function createWidget(name, temp, weather, icon) {
  wrapper.innerHTML = "";
  wrapper.insertAdjacentHTML(
    "beforeend",
    `
    <h1 class="city">${name}</h1>
    <div class="widget">
    <img class="image" src="http://openweathermap.org/img/w/${icon}.png"/>
    <span class="temp">${Math.round(temp)}°С</span>
    <span class="weather">${weather}</span>
  </div>
  `
  );
}
