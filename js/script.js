// Getting API details
var apiKey = "A3GWr1bAKM9umGLc1IVcH5AWbfGcFkxQ";
var apiURL =
  "https://app.ticketmaster.com/discovery/v2/events.json?sort=random&apikey=";
var proxyURL = "https://api.allorigins.win/get?url=";

// Targeting html elements and store to variables
var searchInput = $(".search");
var itemWrapper = $("main");
var exitButton = $("#reset");
var map;


// creates a map
function initMap() {
  var mapDiv = document.getElementById("map");
  map = new google.maps.Map(mapDiv, {
    center: { lat: 51.509865, lng: -0.118092 },
    zoom: 6,
  });
}

// adds markers for events
function addMarker(map, event) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(
      event._embedded.venues[0].location.latitude,
      event._embedded.venues[0].location.longitude
    ),
    map: map,
  });
}

// Function to create HTML div (use backtick so you can insert variables) to display events for an inputted city
function displayMatches(matches) {
  itemWrapper.html(""); // clear off the paragraph text when a city is entered

  if (!matches) {
    itemWrapper.html(`<p class="no-search">No results found.</p>`); // Displaying no results found if city entered is not found
    
  
  } else {
    map.setCenter({
      lat: Number(matches[0]._embedded.venues[0].location.latitude),
      lng: Number(matches[0]._embedded.venues[0].location.longitude),
    });
    map.setZoom(10);
    for (var matchObj of matches) {

      // Loop through the the events for a city and display them on the screen with their titles, date, time, venue and background image as shown in the var=events (console.log(events) to see the various properties to pass in to view title and the rest). Styling of the background image is done in CSS
      itemWrapper.append(`      
              <div class="event-item" style="background-image:
              linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url(${matchObj.images[0].url})">
              <h3>Event Title: ${matchObj.name}</h3>
              <p><b>Event Date</b>: ${matchObj.dates.start.localDate} </p>
              <p><b>Event Time</b>: ${matchObj.dates.start.localTime} </p>
              <p><b>Venue Name</b>: ${matchObj._embedded.venues[0].name} </p>
              <a href=${matchObj.url} target="_blank">Find Out More</a>
              </div> 
            `);
      addMarker(map, matchObj);
    }
  }
}

// Function to get events for city name entered by user.
function getEventData(event) {
  
  var keyCode = event.keyCode; // Get the key that was pressed
  var searchText = searchInput.val().trim(); // Gets the input entered by user and remove any spacings using the trim(). (the database is not case sensitive so no need to use the toLowerCase()
  
  if (keyCode === 13 && searchText) {
    itemWrapper.html(`<div class="loader"></div>`)
    // Checking to see if the key pressed is the enter key and if some text is typed in the input box

    // Making an AJAX Request to get data from a server using the Ticketmaster API. The proxyURL and encodeURIComponent() function takes care of the CORS issue in the browser
    $.get(
      proxyURL + encodeURIComponent(apiURL + apiKey + `&city=${searchText}`)
    ).then(function (data) {
      var events = JSON.parse(data.contents)._embedded.events;
      console.log(events);
      displayMatches(events); // fetching events from external server based on the city the user types in - the .get() method in jQuery makes this so easy it's like the fetch method in vanilla javaScript but it does all the json and parsing for us
    }); 
  }
};  



// Create an initializing function - when the page loads, things that will run initially - listens for a key press*/
function init() {
  searchInput.keydown(getEventData);
}

init();
