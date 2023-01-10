// Getting API details
var apiKey = "A3GWr1bAKM9umGLc1IVcH5AWbfGcFkxQ";
var apiURL =
  "https://app.ticketmaster.com/discovery/v2/events.json?sort=random&countryCode=GB&apikey=";
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
              <a href=${matchObj.url} target="_blank">View More Info About Event</a>
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
      displayMatches(events);
    }); // fetching events from external server based on the city the user types in - the .get() method in jQuery makes this so easy it's like the fetch method in vanilla javaScript but it does all the json and parsing for us

    /* // Shorter and modern version of the code for making AJAX request in vanilla javaScript to a server (Arrow Function)
    fetch('https://www.omdbapi.com/?apikey=2a194df&t=drive')
    .then(res => res.json())
    .then(data => console.log(data));*/
  }
}

// Function to show more details if the 'view more details' link is clicked on a movie
/*function showMovieDetails(movieId) {
    // Making an AJAX Request to get data from a movie server using the movie ID
    $.get(`https://www.omdbapi.com/?apikey=2a194df&i=${movieId}`)  // fetching movie from external server based on the ID of the movie the user types in 
        .then(function (data) {
            var detailDisplay = $('.detail-display'); // Targeting the div that holds the details to be displayed

            // Writing the content of the div using javaScript - styling is already done in CSS
            detailDisplay.html(`                     
    <h2>Title: ${data.Title}</h2>
    <h3>Release Year: ${data.Year}</h3>
    <p><strong>Plot:</strong> ${data.Plot}</p>
    <p><strong>Genre:</strong> ${data.Genre}</p>
    <a href="https://www.imdb.com/title/${data.imdbID}" target="_blank">View IMDB Page</a>
    <button id="reset" onclick="this.parentNode.remove(); return false;">Exit</button>`); // onclick="this.parentNode.remove(); return false;" removes the detailDisplay when clicked. It has to be written this way as the button is inside the div which is displayed on the fly.

            detailDisplay.removeClass('hide');  // displaying the details on the browser once the 'view more details' link is clicked
        });

}


// Create an initializing function - when the page loads, things that will run initially - listens for a key press*/
function init() {
  searchInput.keydown(getEventData);

  // Add event listener for when 'view more details' button on a movie is clicked
  /*itemWrapper.click(function (event) {
      event.preventDefault();
      var anchorLink = event.target;  // Targeting the actual button clicked as there are many buttons on the page

      if (anchorLink.tagName === 'A') {             // If the button clicked is the anchor tag <a> button then call the showMovieDetails() function created above and pass in the id of the movie clicked
          showMovieDetails(anchorLink.dataset.id)
      }
  });*/
}

init();
