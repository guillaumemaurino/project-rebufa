$(document).ready(function(){
  $('li').on('click', function(){
        console.log('delete click')
        console.log(this);
      var item = $(this).text().replace(/ /g, "-");
      console.log(item);
      if (item != ""){
        $.ajax({
          type: 'DELETE',
          url: '/outings/' + item,
          success: function(data){
            //do something with the data via front-end framework
            //location.reload();
          }
        });
      }
  });
});

var client = algoliasearch("TR971CJDWI", "fc29e88ddda3305761a94ef15e700bd1");
var index_routes = client.initIndex('routes');
var index_outings = client.initIndex('outings');

//initialize autocomplete on search input (ID selector must match)
autocomplete('#aa-search-input',
  { hint: false },
  [
    {
      source: autocomplete.sources.hits(index_routes, { hitsPerPage: 3 }),
      displayKey: 'title',
      templates: {
        header: '<div class="aa-suggestions-category">Routes</div>',
        suggestion: function(suggestion) {
          return '<span>' +
          suggestion._highlightResult.title.value + '</span><span>'
          + suggestion._highlightResult.title_prefix.value + '</span>';
        }
    }
  }]).on('autocomplete:updated', function() {
    if (searchInput.value.length > 0) {
        inputContainer.classList.add("input-has-value");
    }
    else {
        inputContainer.classList.remove("input-has-value");
    }
}).on('autocomplete:selected', function(event, suggestion, dataset) {
    //console.log(suggestion);
    //console.log(suggestion._id);
    post_new_outing(suggestion);
});;

//DOM Binding
var searchInput = document.getElementById("aa-search-input");
var inputContainer = document.getElementById("aa-input-container");
//Handle add/removing a class based on if text has been entered in the search input
//attach custom event handler - autocomplete:updated triggers when dataset is rendered

function new_outing_fire(){
  // if the user press enter;
  if(event.keyCode == 13) {
        post_new_outing(undefined);
    }
}

function post_new_outing(suggestion){
  console.log(searchInput.value);
  // we are going to created a post
  var outing = {
    title: searchInput.value,
    route_ids : []
  };
  if (suggestion != undefined){
    outing.title = suggestion.title_prefix + " - " + suggestion.title;
    outing.route_ids.push(suggestion._id);
  }
  console.log('Posting new outing');
  console.log(outing);
  $.ajax({
    type: 'POST',
    url: '/outings',
    data: JSON.stringify(outing),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    success: function(data){
      //do something with the data via front-end framework
      //location.reload();
    }
  });
  //window.location.href = 'routes' + '?q=' +  searchInput.value + '&hPP=10&idx=routes&p=0&is_v=1';
}

//Handle clearing the search input on close icon click
document.getElementById("icon-close").addEventListener("click", function() {
    searchInput.value = "";
    inputContainer.classList.remove("input-has-value");
});