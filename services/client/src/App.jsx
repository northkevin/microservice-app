import React, {Component} from "react";
import axios from 'axios';

import UsersList from './components/UsersList';
import AddUser from './components/AddUser';
import About from './components/About';
import { Route, Switch } from 'react-router-dom';

class App extends Component
{
  constructor()
  {
    super();
    this.state = {
      users: [],
      username: 'autohotload test',
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

  // Send request to my services/users endpoint to persist user entries.. POST
  addUser(event)
  {
    event.preventDefault();
    const data =
      {
        username: this.state.username,
        email: this.state.email
      };

    // send POST to services/users service to called 'db.session.add(username=username, email=email)')
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
         .then((res) =>
         {
           this.getUsers(); //creates a new component to be displayed to the user
           this.setState({username: '', email: ''});
         })
         .catch((err) =>
         {
           console.log(err);
         });
  };

  handleChange(event)
  {
    const obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  }

  getUsers()
  {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => { this.setState({ users: res.data.data.users }); })
      .catch((err) => { console.log(err); });
  }

  render()
  {
    return (
      <section className="section">
        <div className="container">
          <div className="columnns">
            <div className="column is-half">
              <br/>
              <Switch>
                <Route exact path='/' render={() => (
                  <div>
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
                )} />
                <Route exact path='/about' component={About}/>
              </Switch>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default App;