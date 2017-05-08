const configAlgolia = require('../config/algolia_config.js');

var search = instantsearch({
  // Replace with your own values
  appId: configAlgolia.applicationID,
  apiKey: configAlgolia.searchKey, // search only API key, no ADMIN key
  indexName: 'routes',
  urlSync: true
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#aa-search-input',
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
