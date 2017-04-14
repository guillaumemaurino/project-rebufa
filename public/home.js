var client = algoliasearch("TR971CJDWI", "fc29e88ddda3305761a94ef15e700bd1");
var index_routes = client.initIndex('routes');
var index_outings = client.initIndex('outings');

autocomplete('#aa-search-input', {}, [

]);

//initialize autocomplete on search input (ID selector must match)
autocomplete('#aa-search-input',
  { hint: false },
  [
  {
    source: autocomplete.sources.hits(index_outings, { hitsPerPage: 3 }),
    displayKey: 'title',
    templates: {
      header: '<div class="aa-suggestions-category">Outings</div>',
      suggestion: function(suggestion) {
        var result = '<span>' + suggestion._highlightResult.title.value + '</span>';
        console.log(suggestion._highlightResult.description)
        if (suggestion._highlightResult.participants != undefined){
          result += '<span>' + suggestion._highlightResult.participants.value + '</span>';
        }
        else if (suggestion._highlightResult.user_ids.length > 0){
          result += '<span>' + suggestion._highlightResult.user_ids[0].value + '</span>';
        }
        return result;
      }
    }
  },
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
    window.location.href = 'routes' + '?q=' +  searchInput.value + '&hPP=10&idx=routes&p=0&is_v=1';
});;

//DOM Binding
var searchInput = document.getElementById("aa-search-input");
var inputContainer = document.getElementById("aa-input-container");
//Handle add/removing a class based on if text has been entered in the search input
//attach custom event handler - autocomplete:updated triggers when dataset is rendered

function search_fire(){
  if(event.keyCode == 13) {
        window.location.href = 'routes' + '?q=' +  searchInput.value + '&hPP=10&idx=routes&p=0&is_v=1';
    }
}

//Handle clearing the search input on close icon click
document.getElementById("icon-close").addEventListener("click", function() {
    searchInput.value = "";
    inputContainer.classList.remove("input-has-value");
});
