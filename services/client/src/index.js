import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import UsersList from './components/UsersList';
import AddUser from './components/AddUser';

class App extends Component
{
  constructor()
  {
    super();
    this.state = {
      users: [],
      username: '',
      email: '',
    };

    this.addUser = this.addUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // 'componentDidMount' will make the method call when Ajax is completed mounting the app
  // https://pbs.twimg.com/media/DZ-97vzW4AAbcZj.jpg:large
  componentDidMount()
  {
    this.getUsers();
  }

  // Send request to my services/users endpoint .. POST
  addUser(event)
  {
    event.preventDefault();
    console.log('this.state.username ', this.state.username);
    console.log('this.state.email ', this.state.email);
    console.log('sanity check!');
    console.log('this.state: ', this.state)
    const data = {
      username: this.state.username,
      email: this.state.email
    };
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then((res) => { console.log(res); })
      .catch((err) => { console.log(err); });
  };

  //TODO identify where the 'setState' method is defined
  //TODO_LESSONS_LEARNED_1 identify where the '.name' property comes from within the 'event.target.name'
  handleChange(event)
  {
    console.log('index.js - App#handleChange(event) - event: ', event);
    console.log('index.js - App#handleChange(event) - event.type: ', event.type);
    console.log('index.js - App#handleChange(event) - event.name: ' + event.name);
    console.log('index.js - App#handleChange(event) - event.toString(): ' + event.toString());
    console.log('-------------------------------------------------------------------------------------')
    console.log('index.js - App#handleChange(event) - event.target: ', event.target);
    console.log('index.js - App#handleChange(event) - event.target.name: ', event.target.name);
    console.log('index.js - App#handleChange(event) - event.target.class: ', event.target.class);
    console.log('index.js - App#handleChange(event) - event.target.type: ', event.target.type);
    console.log('index.js - App#handleChange(event) - event.target.placeholder: ', event.target.placeholder);
    console.log('index.js - App#handleChange(event) - event.target.required: ', event.target.required);
    console.log('index.js - App#handleChange(event) - event.target.arbitraryproperty: ', event.target.arbitraryproperty);
    console.log("index.js - App#handleChange(event) - event.target.getAttribute('arbitraryproperty': ", event.target.getAttribute('arbitraryproperty'));
    console.log('index.js - App#handleChange(event) - event.target.value: ', event.target.value);
    const obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  }

  render()
  {
    return (
      <section className="section">
        <div className="container">
          <div className="columnns">
            <div className="column is-half">
              <br/>
              <h1 className="title is-1">All Users</h1>
              <hr/><br/>
              <AddUser
                username={this.state.username}
                email={this.state.email}
                addUser={this.addUser}
                handleChange={this.handleChange}
              />
              <br/><br/>
              <UsersList users={this.state.users}/>
            </div>
          </div>
        </div>
      </section>
    )
  }

  getUsers()
  {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => { this.setState({ users: res.data.data.users }); })
      .catch((err) => { console.log(err); });
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);