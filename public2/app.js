var search = instantsearch({
  // Replace with your own values
  appId: 'TR971CJDWI',
  apiKey: 'fc29e88ddda3305761a94ef15e700bd1', // search only API key, no ADMIN key
  indexName: 'routes',
  urlSync: false
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search-input',
    placeholder: 'Search for routes'
  })
);


search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 10,
    templates: {
      item: getTemplate('hit'),
      empty: getTemplate('no-results')
    }
  })
);

function getTemplate(templateName) {
  return document.getElementById(templateName + '-template').innerHTML;
}

search.addWidget(
  instantsearch.widgets.stats({
    container: '#stats'
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination'
  })
);

// Filter on categories
search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#activity',
    attributeName: 'activities',
    limit: 10,
    sortBy: ['isRefined', 'count:desc', 'name:asc'],
    operator: 'or',
    templates: {
      header: '<h5>Activities</h5>'
    }
  })
);

search.start();


var client = algoliasearch("TR971CJDWI", "fc29e88ddda3305761a94ef15e700bd1");
var index = client.initIndex('routes');
//initialize autocomplete on search input (ID selector must match)
autocomplete('#aa-search-input',
{ hint: false }, {
    source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
    //value to be displayed in input control after user's suggestion selection
    displayKey: 'title',
    //hash of templates used when rendering dataset
    templates: {
        //'suggestion' templating function used to render a single suggestion
        suggestion: function(suggestion) {
          //console.log(suggestion);
          return '<span>' +
            suggestion._highlightResult.title.value + '</span><span>' +
            suggestion._highlightResult.title_prefix.value + '</span>';
        }
    }
}).on('autocomplete:updated', function() {
    if (searchInput.value.length > 0) {
        inputContainer.classList.add("input-has-value");
    }
    else {
        inputContainer.classList.remove("input-has-value");
    }
});

//DOM Binding
var searchInput = document.getElementById("aa-search-input");
var inputContainer = document.getElementById("aa-input-container");
//Handle add/removing a class based on if text has been entered in the search input
//attach custom event handler - autocomplete:updated triggers when dataset is rendered

//Handle clearing the search input on close icon click
document.getElementById("icon-close").addEventListener("click", function() {
    searchInput.value = "";
    inputContainer.classList.remove("input-has-value");
});
