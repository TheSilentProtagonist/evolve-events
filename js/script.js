// Getting API details
var apiKey = "A3GWr1bAKM9umGLc1IVcH5AWbfGcFkxQ";
var apiURL =
  "https://app.ticketmaster.com/discovery/v2/events.json?sort=random&apikey=";
var proxyURL = "https://api.allorigins.win/get?url=";

// Targeting html elements and store to variables
var searchInput = $(".search");
var itemWrapper = $("main");
var exitButton = $('#reset');
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
    itemWrapper.html(`<p class="no-search">No Events Found.</p>`); // Displaying no events found if city entered is not found
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
              <h3>Title: ${matchObj.name}</h3>
              <p><b>Date</b>: ${matchObj.dates.start.localDate} </p>
              <p><b>Time</b>: ${matchObj.dates.start.localTime} </p>
              <p><b>Venue</b>: ${matchObj._embedded.venues[0].name} </p>
              <a data-id="${matchObj.id}" href="">Find Out More</a>
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
    itemWrapper.html(`<div class="loader"></div>`);
    // Checking to see if the key pressed is the enter key and if some text is typed in the input box

    // Making an AJAX Request to get data from a server using the Ticketmaster API. The proxyURL and encodeURIComponent() function takes care of the CORS issue in the browser
    $.get(
      proxyURL + encodeURIComponent(apiURL + apiKey + `&city=${searchText}`)
    )
      .then(function (data) {
        var events = JSON.parse(data.contents)._embedded.events;
        //console.log(events);
        displayMatches(events); // fetching events from external server based on the city the user types in - the .get() method in jQuery makes this so easy it's like the fetch method in vanilla javaScript but it does all the json and parsing for us
      })
    /*.catch(
      (error) => itemWrapper.html(`<p class="no-search">NO EVENTS FOUND</p>`) 
    ); // Displaying no events found if city entered is not within API's search radius*/
  }
}


// Function to show more details if the 'Find out more' link is clicked on an event
function findOutMore(eventId) {
  // Making an AJAX Request to get data from a Event server using the movie ID
  $.get(proxyURL + encodeURIComponent(apiURL + apiKey + `&id=${eventId}`))
    .then(function (data) {
      var detail = JSON.parse(data.contents)._embedded.events;
      console.log(detail);
      var eventDetails = $('.detail-display'); // Targeting the div that holds the details to be displayed

      if (detail[0].pleaseNote) {
        // Writing the content of the div using javaScript - styling is already done in CSS
      eventDetails.html(`                     
      <h2>Title: ${detail[0].name}</h2>
      <h3>Genre: ${detail[0].classifications[0].genre.name}</h3>
      <p><strong>Event Info:</strong> ${detail[0].pleaseNote + detail[0].info + "."}</p>
      <p><strong>Ticket Price Range:</strong> ${detail[0].priceRanges[0].currency + detail[0].priceRanges[0].min + " - " + detail[0].priceRanges[1].currency + detail[0].priceRanges[1].max}</p>
      <a href=${detail[0].url} target="_blank">View Seats & Buy a Ticket</a>
      <button id="reset" onclick="this.parentNode.remove(); return false;">Exit</button>`); // onclick="this.parentNode.remove(); return false;" removes the eventDetail when clicked. It has to be written this way as the button is inside the div which is displayed on the fly.
    
          eventDetails.removeClass('hide');  // displaying the details on the browser once the 'Find out more' link is clicked
        
      } else {
        // Writing the content of the div using javaScript - styling is already done in CSS
      eventDetails.html(`                     
      <h2>Title: ${detail[0].name}</h2>
      <h3>Genre: ${detail[0].classifications[0].genre.name}</h3>
      <a href=${detail[0].url} target="_blank">View Seats & Buy a Ticket</a>
      <button id="reset" onclick="this.parentNode.remove(); return false;">Exit</button>`); // onclick="this.parentNode.remove(); return false;" removes the eventDetail when clicked. It has to be written this way as the button is inside the div which is displayed on the fly.
    
          eventDetails.removeClass('hide');  // displaying the details on the browser once the 'Find out more' link is clicked

      }

      
  });

}



// Create an initializing function - when the page loads, things that will run initially - listens for a key press*/
function init() {
  searchInput.keydown(getEventData);

  // Add event listener for when 'find out more' button on an event is clicked
  itemWrapper.click(function (event) {
    event.preventDefault();
    var anchorLink = event.target;  // Targeting the actual button clicked as there are many buttons on the page

    if (anchorLink.tagName === 'A') {             // If the button clicked is the anchor tag <a> button then call the findOutMore() function created above and pass in the id of the event clicked
      findOutMore(anchorLink.dataset.id)
    }
  });
}

init();
