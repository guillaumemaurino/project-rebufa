const client = algoliasearch(window.applicationID, window.searchKey);
var index_routes = client.initIndex('routes');
var index_outings = client.initIndex('outings');
var index_activity = client.initIndex('activity');


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


//initialize autocomplete on search input (ID selector must match)
autocomplete('#aa-search-outing',
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
    if (search_outing.value.length > 0) {
        input_outing.classList.add("input-has-value");
    }
    else {
        input_outing.classList.remove("input-has-value");
    }
}).on('autocomplete:selected', function(event, suggestion, dataset) {
    //console.log(suggestion);
    //console.log(suggestion._id);
    post_new_outing(suggestion);
});;

//DOM Binding
var search_outing = document.getElementById("aa-search-outing");
var input_outing = document.getElementById("aa-input-outing");
//Handle add/removing a class based on if text has been entered in the search input
//attach custom event handler - autocomplete:updated triggers when dataset is rendered

function new_outing_fire(){
  // if the outing press enter;
  if(event.keyCode == 13) {
        post_new_outing(undefined);
    }
}

function post_new_outing(suggestion){
  console.log(search_outing.value);
  // we are going to created a post
  var outing = {
    title: search_outing.value,
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
      location.reload();
    }
  });
  //window.location.href = 'routes' + '?q=' +  search_outing.value + '&hPP=10&idx=routes&p=0&is_v=1';
}

//Handle clearing the search input on close icon click
document.getElementById("icon-outing-close").addEventListener("click", function() {
    search_outing.value = "";
    input_outing.classList.remove("input-has-value");
});
