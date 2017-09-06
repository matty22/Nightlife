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
        let barArray = JSON.parse(xhr.responseText)
        console.log(barArray);
        barArray.forEach(function(element) {
          var cardChild = document.createElement("div");
          cardChild.innerHTML = "<img src='" + element.image_url +"' width='200' height='200'>" + "<a href='" + element.url + "'>" + element.name + "</a><p>" + element.location + "</p><input type='button' value='Im going!'>";
          document.getElementById("resultsGrid").appendChild(cardChild);
        });
      }
      else {
          console.error("you suck: search.js page");
      }
  }
  xhr.send(json);
}