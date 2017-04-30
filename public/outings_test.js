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

function change_outing(outing_id, i) {
  var change_outing_description = document.getElementById("change_outing_description" + i);
  var change_outing_conditions = document.getElementById("change_outing_conditions" + i);

  if(event.keyCode == 13) {
    const ul = document.getElementById('outings_js');
    const url = '/outings/' + outing_id;
    console.log(url);
      var request = new Request(url, {
        method: 'GET',
        headers: new Headers()
      });

      // Now use it!
      fetch(request)
      .then((resp) => resp.json())
      .then(function(data) {
            console.log('Front end - get outing:')
            console.log(data);
            // Here we should do a put to update the name !!!!
            if (change_outing_description.value != ""){
              data.description = change_outing_description.value;
              console.log('Changing outing descriptions');
            }
            if (change_outing_conditions.value != ""){
              data.conditions = change_outing_conditions.value;
              console.log('Changing outing conditions');
            }
            var request = new Request(url, {
              method: 'PUT',
              body: JSON.stringify( data ),
              headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
              }
            });
            fetch(request)
            .then((resp) => resp.json())
            .then(function(data) {
              console.log('Front end - put request result:')
              console.log(data);
              //location.reload();
            })
            .catch(function(error) {
              console.log(error);
            });
      })
      .catch(function(error) {
        console.log(error);
      });
    }
};
