function change_name(user_id) {
  var change_name = document.getElementById("change_name_input");
  if(event.keyCode == 13) {
    const ul = document.getElementById('users_js');
    const url = '/users/' + user_id;
    console.log(url);
      var request = new Request(url, {
        method: 'GET',
        headers: new Headers()
      });

      // Now use it!
      fetch(request)
      .then((resp) => resp.json())
      .then(function(data) {
            console.log('Front end - get user:')
            console.log(data);
            // Here we should do a put to update the name !!!!
            data.name = change_name.value;
            console.log(data);
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
              location.reload();
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

function change_summary(user_id) {
  var change_summary = document.getElementById("change_summary_input");
  if(event.keyCode == 13) {
    const ul = document.getElementById('users_js');
    const url = '/users/' + user_id;
    console.log(url);
      var request = new Request(url, {
        method: 'GET',
        headers: new Headers()
      });

      // Now use it!
      fetch(request)
      .then((resp) => resp.json())
      .then(function(data) {
            console.log('Front end - get user:')
            console.log(data);
            // Here we should do a put to update the name !!!!
            data.summary = change_summary.value;
            console.log(data);
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
              location.reload();
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
