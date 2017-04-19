function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}


function change_name(user_id) {
  var change_name = document.getElementById("change_name_input");
  console.log(change_name.value);
  if(event.keyCode == 13) {
    const ul = document.getElementById('users_js');
    const url = '/api/users/' + user_id;
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
              // get a ref to your element and assign value
              var elem = document.getElementById("display_name");
              elem.value = data.name;
            })
            .catch(function(error) {
              console.log(error);
            });
      })
      .catch(function(error) {
        console.log(error);
      });
    }
}

var Users = React.createClass({
    getInitialState: function(){
        return({
            users: []
        });
    },
    render: function(){
        var users = this.state.users;
        console.log(users);
        users = users.map(function(user, index){
          console.log(user);
            return(
                <li key={index}>
                    <span className="name">{user.name}</span>
                </li>
            );
        });
        return(
            <div id="user-container">
                <form id="search" onSubmit={this.handleSubmit}>
                    <input type="submit" value="Find Users" />
                </form>
                <ul>{users}</ul>
            </div>
        );
    },
    handleSubmit: function(e){
        e.preventDefault();
        fetch('/api/users').then(function(data){
            return data.json();
        }).then( json => {
            this.setState({
                users: json
            });
            console.log(json);
        });
    }
});
ReactDOM.render(<Users />, document.getElementById('users'));
