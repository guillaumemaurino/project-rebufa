var client = algoliasearch("TR971CJDWI", "fc29e88ddda3305761a94ef15e700bd1");
var index_users = client.initIndex('users');

//initialize autocomplete on search input (ID selector must match)
autocomplete('#aa-search-participants',
  { hint: false },
  [{
      source: autocomplete.sources.hits(index_users, { hitsPerPage: 3 }),
      displayKey: 'name',
      templates: {
        header: '<div class="aa-suggestions-category">Users</div>',
        suggestion: function(suggestion) {
          return '<span>' + suggestion._highlightResult.name.value + '</span>';
        }
    }
  }]).on('autocomplete:updated', function() {
    if (search_participants.value.length > 0) {
        input_participants.classList.add("input-has-value");
    }
    else {
        input_participants.classList.remove("input-has-value");
    }
}).on('autocomplete:selected', function(event, suggestion, dataset) {
    //console.log(suggestion);
    //console.log(suggestion._id);
    post_new_participants(suggestion);
});;

//DOM Binding
var search_participants = document.getElementById("aa-search-participants");
var input_participants = document.getElementById("aa-input-participants");
//Handle add/removing a class based on if text has been entered in the search input
//attach custom event handler - autocomplete:updated triggers when dataset is rendered

function change_outing(outing_id) {
  var change_outing_description = document.getElementById("change_outing_description");
  var change_outing_conditions = document.getElementById("change_outing_conditions");

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


function new_participants_fire(){
  // if the participants press enter;
  if(event.keyCode == 13) {
        post_new_participants(undefined);
    }
}

function post_new_participants(suggestion){
  console.log(search_participants.value);
  // we are going to created a post
  var participants = {
    title: search_participants.value,
  };
  if (suggestion != undefined){
    participants.title = suggestion.title_prefix + " - " + suggestion.title;
    participants.route_ids.push(suggestion._id);
  }
  console.log('Posting new participants');
  console.log(participants);
  $.ajax({
    type: 'POST',
    url: '/participants',
    data: JSON.stringify(participants),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    success: function(data){
      //do something with the data via front-end framework
      location.reload();
    }
  });
  //window.location.href = 'routes' + '?q=' +  search_participants.value + '&hPP=10&idx=routes&p=0&is_v=1';
}

//Handle clearing the search input on close icon click
document.getElementById("icon-participants-close").addEventListener("click", function() {
    search_participants.value = "";
    input_participants.classList.remove("input-has-value");
});
