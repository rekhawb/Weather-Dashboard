var eleContainer = document.getElementById("displayResults");
var fetchButton = document.getElementById("search");
var eleContainer1 = document.getElementById("displayResults2");
var srchContainer = document.getElementById("srchCard");
var btnSrch = document.getElementById("btn");

function getApi() {
  eleContainer.innerHTML = "";
  eleContainer1.innerHTML = "";

  //pull city from the search box
  var paramCity = document.getElementById("srchCity").value.trim();
  //insert the city to search into the url and contruct the url
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${paramCity}&units=imperial&appid=f507df7a1f6e477124070c1e676d907b`;

  //searchResultsArr = [];
  //set local storage item to store searches. if we donot have the first search yet, insert a random city

  if (localStorage.getItem("Search Terms") === null) {
    localStorage.setItem("Search Terms", "Macon");
  } else {
  }

  var searchHistory = localStorage.getItem("Search Terms").split(",");
  srchContainer.innerHTML = "";
  for (i = searchHistory.length - 1; i > 3; i--) {
    htmlCreate = ` <div style="background-color:#A9A9A9; font-size:2rem;border-radius:5px;text-align:center;height:100%;padding:5px;margin:5px">
   <button id="btn" style="width:100%; padding:5px; margin:5px; background-color:#A9A9A9;border:none;height:60% ">${searchHistory[i]}</button>
   </div>`;

    srchContainer.innerHTML = srchContainer.innerHTML + htmlCreate;
  }

  //pull lat and lon co ordinates for the search city

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var resultsDt = new Date(Date.now()).toLocaleDateString("en-US");

      var resultsCity = data.name;

      var resultsLat = data.coord.lat;
      var resultsLon = data.coord.lon;

      var htmlCreate = "";

      //pass the lat lon co ordinates to the getForecast

      getForecast(resultsLat, resultsLon, resultsCity, resultsDt);
    });
}

function getForecast(resultsLat, resultsLon, resultsCity, resultsDt) {
  requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${resultsLat}&lon=${resultsLon}&units=imperial&exclude=hourly,minutely,alerts&appid=f507df7a1f6e477124070c1e676d907b`;
  var htmlCreate = "";

  //if resultsCity is blank or city name is not valid, donot  store in the search history

  if (resultsCity === "") {
  } else {
    var localstr = localStorage.getItem("Search Terms");
    if (localstr.includes(resultsCity)) {
    } else {
      localStorage.setItem(
        "Search Terms",
        localStorage.getItem("Search Terms") + "," + resultsCity
      );
    }
  }

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var resultsCur = data.current;

      resultsCity = resultsCity + "  (" + resultsDt + ")";
      var resultsTemp = resultsCur.temp + " <span>&#176;</span>F";
      var resultsHmdty = resultsCur.humidity + " %";
      var resultsWind = resultsCur.wind_speed + " MPH";
      var resultsUvi = resultsCur.uvi;

      var resultsIcn = resultsCur.weather[0].icon;

      // pull the icon to show weather icon on page

      var imgURL = `http://openweathermap.org/img/w/${resultsIcn}.png`;

      htmlCreate = ` <div class="col-sm-6 resultsCard1" style= "border: solid 1px black">
      <h3>${resultsCity} <img src ='http://openweathermap.org/img/w/${resultsIcn}.png'/></h3>
       <p>Temp:  ${resultsTemp}</p>
       <p>Wind: ${resultsWind}</p>
       <p>Humidity: ${resultsHmdty}</p>
       <p>UV Index: <span id="colorUV">${resultsUvi}</span></p>
       </div>
       `; //+ htmlCreate;



      var htmlCreate1 = ` <div class="col-sm-6" >
      <h3 style="font-weight:10px; text-align:right">5 Day Forecast:</h3>
      </div>`

      eleContainer.innerHTML = htmlCreate+htmlCreate1;

    var colorUvIndex = document.getElementById('colorUV').textContent;
    //colorUvIndex = colorUvIndex.substring(10,);

    if(colorUvIndex <3){
      document.getElementById('colorUV').style.backgroundColor= 'green';
    }else  if(colorUvIndex >=3 && colorUvIndex < 6 ){
      document.getElementById('colorUV').style.backgroundColor= 'yellow';
    }else  if(colorUvIndex >=6 && colorUvIndex < 8 ){
      document.getElementById('colorUV').style.backgroundColor= 'orange';
    }else  if(colorUvIndex >=8 && colorUvIndex <11 ){
      document.getElementById('colorUV').style.backgroundColor= 'red';
    }



      htmlCreate = "";

      // show 5 day forecast

      var resultsDaily = data.daily;
      // console.log(resultsDaily);
      resultsDt = new Date();

      for (i = 0; i < resultsDaily.length - 3; i++) {
        resultsDt = new Date();
        resultsDt.setDate(resultsDt.getDate() + i);
        resultsDt = resultsDt.toISOString().substring(0, 10);
        var resultsTemp = resultsDaily[i].temp.day + " <span>&#176;</span>F";
        var resultsHmdty = resultsDaily[i].humidity + " %";
        var resultsWind = resultsDaily[i].wind_speed + " MPH";

        var resultsIcon = resultsDaily[i].weather[0].icon;

        htmlCreate = ` <div class="col-sm-1  resultsCard  text-white"> 
      <p style="font-size:2rem">${resultsDt}<p>
      <p>Temp:  ${resultsTemp}</p>   
      <img src ='http://openweathermap.org/img/w/${resultsIcon}.png'/>
       <p>Temp:  ${resultsTemp}</p>
       <p>Wind: ${resultsWind}</p>
       <p>Humidity: ${resultsHmdty}</p>  
       </div>      
       `; //+ htmlCreate;

        eleContainer1.innerHTML = eleContainer1.innerHTML + htmlCreate;
      }
    });
}

fetchButton.addEventListener("click", getApi);

// add an event listener on document. check if its a btn ID, if it is, pull the city name and pass it to the search city. And display results for the city selected from the search history

document.addEventListener("click", function (event) {
  var btnID = event.target.id;
  if (btnID === "btn") {
    // alert(event.target.innerHTML);
    document.getElementById("srchCity").value = event.target.innerHTML;
    getApi();
  }
});
