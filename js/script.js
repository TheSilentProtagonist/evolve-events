// Richard's SerpApi key = 42bcbd572bd634476035e011597fcb1832b3569dc9df399795dce3ff2cb56577

var searchInput = document.querySelector('.search')
var itemWrapper = document.querySelector('main')


function displayMatches(matches) {
  itemWrapper.innerHTML = '';

  if (!matches) {
    return itemWrapper.innerHTML = '<p>Sorry, we were unable to locate your city. Please try again.</p>'
  }

  for (match of matches) {
    itemWrapper.insertAdjacentHTML('beforeend', `
    <div class="event-item">
      <h3>City: ${match.city}</h3>
      <p>Event Type: ${match.event} </p>
      <p>Venue: ${match.venue}</p>
      <p>Event Description: ${match.description}</p>
      <a href="${match.eventURL}" target="_blank">Go To Event</a><hr>
      <a data-id="${match.placeholder}" href="https://www.google.com/maps" target="_blank">View Event Location</a>
    </div>
    `)
    console.log(match);
  }
}

function getEventData(event) {
  var keyCode = event.keyCode
  var searchText = searchInput.value.trim()
  
  if (keyCode === 13 && searchText) {
    var matches = [];

    for(searchCity of allCities) {
      if(searchCity.city.toLowerCase() === searchText) {
        matches.push(searchCity)
      }
    }
    displayMatches(matches);
  }
}


function init() {
  searchInput.addEventListener('keydown', getEventData)
}

init()




