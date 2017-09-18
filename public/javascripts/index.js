
var gServerResponse;
var user_token;


// Function runs when user hits the search button
function search() {
  let searchObj = {};
  searchObj.location = document.getElementById('searchQuery').value;
  searchObj.term = 'nightlife';

  let json = JSON.stringify(searchObj);
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://matty22nightlife.herokuapp.com/search', true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function() {
      if (xhr.status === 200) {
        // Clear old search results out of the DOM
        document.getElementById("resultsGrid").innerHTML = '';
        let serverResponse = JSON.parse(xhr.responseText);
        gServerResponse = serverResponse;
        // For each object in the array of businesses, create a card and insert it into the DOM
        let barArray = serverResponse.results;
         barArray.forEach(function(element) {
          var cardChild = document.createElement("div");
          let isAuthenticated = localStorage.getItem('userId');
          if (isAuthenticated) {
            cardChild.innerHTML = "<img src='" + element.image_url +"' width='200' height='200'>" + "<a href='" + element.url + "'>" + element.name + "</a><p>" + element.location + "</p><input id='" + element.id + "'type='button' value='Im going! (" + element.votes + ")' onclick='going(event)'>";
          } else if (!isAuthenticated) {
            cardChild.innerHTML = "<img src='" + element.image_url +"' width='200' height='200'>" + "<a href='" + element.url + "'>" + element.name + "</a><p>" + element.location + "</p><input class='buttonSwitcher' id='" + element.id + "'type='button' value='Im going! (" + element.votes + ")' onclick='going(event)'>";
          }
          document.getElementById("resultsGrid").appendChild(cardChild);
        });
      }
      else {
          console.error("you suck: search() function");
      }
  }
  xhr.send(json);
}


// Function runs when user hits the I'm going button
function going(e) {
  let requestObject = {};
  requestObject.resultsId = e.srcElement.id;
  requestObject.user_token = user_token;

  let json = JSON.stringify(requestObject);
  let xhr = new XMLHttpRequest();
  xhr.open('PUT', 'https://matty22nightlife.herokuapp.com/going', true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function() {
      if (xhr.status === 200) {
        let resultsArray = JSON.parse(xhr.responseText);
        resultsArray.forEach(function(element) {
            if (element.id === requestObject.resultsId) {
                let button = document.getElementById(requestObject.resultsId);
                button.value = "Im going! (" + element.votes + ")"
            }
        })
      }
      else {
          console.error("you suck: going() function");
      }
  }
  xhr.send(json);
}


// Function runs when user signs into Google
function onSignIn(googleUser) {
    user_token = googleUser.getAuthResponse().id_token;
    localStorage.setItem("userId", googleUser.getBasicProfile().getId());

    let buttons = document.getElementsByClassName('buttonSwitcher');
    let buttonArray = [].slice.call(buttons);
    buttonArray.forEach(function(element) {
        element.classList.remove('buttonSwitcher');
    })
  }