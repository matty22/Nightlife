
var gServerResponse;

function search() {
  let searchObj = {};
  searchObj.location = document.getElementById('searchQuery').value;
  searchObj.term = 'nightlife';

  let json = JSON.stringify(searchObj);
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/search', true);
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
          cardChild.innerHTML = "<img src='" + element.image_url +"' width='200' height='200'>" + "<a href='" + element.url + "'>" + element.name + "</a><p>" + element.location + "</p><input id='" + element.id + "'type='button' value='Im going! (" + element.votes + ")' onclick='going(event)'>";
          document.getElementById("resultsGrid").appendChild(cardChild);
        });
      }
      else {
          console.error("you suck: search() function");
      }
  }
  xhr.send(json);
}

function going(e) {
  let requestObject = {};
  requestObject.MongoId = gServerResponse._id;
  requestObject.resultsId = e.srcElement.id;
  requestObject.yelpId = gServerResponse.id;

  let json = JSON.stringify(requestObject);
  let xhr = new XMLHttpRequest();
  xhr.open('PUT', 'http://localhost:3000/going', true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function() {
      if (xhr.status === 200) {
          console.log(JSON.parse(xhr.responseText));
        // // Clear old search results out of the DOM
        // document.getElementById("resultsGrid").innerHTML = '';
        // let serverResponse = JSON.parse(xhr.responseText);
        // gServerResponse = serverResponse;
        // // For each object in the array of businesses, create a card and insert it into the DOM
        // let barArray = serverResponse.results;
        //  barArray.forEach(function(element) {
        //   var cardChild = document.createElement("div");
        //   cardChild.innerHTML = "<img src='" + element.image_url +"' width='200' height='200'>" + "<a href='" + element.url + "'>" + element.name + "</a><p>" + element.location + "</p><input id='" + element.id + "'type='button' value='Im going! (" + element.votes + ")' onclick='going(event)'>";
        //   document.getElementById("resultsGrid").appendChild(cardChild);
        // });
      }
      else {
          console.error("you suck: going() function");
      }
  }
  xhr.send(json);
}