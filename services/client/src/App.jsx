import React, {Component} from "react";
import axios from 'axios';

import UsersList from './components/UsersList';
import AddUser from './components/AddUser';
import About from './components/About';
import { Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import Form from './components/Form';
import Logout from './components/Logout';

class App extends Component
{
  constructor()
  {
    super();
    this.state = {
      users: [],
      username: '',
      email: '',
      title: 'TestDriven.io',
      formData: {
        username: '',
        email: '',
        password: ''
      },
      isAuthenticated: false,
    };

    this.addUser = this.addUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }

  logoutUser()
  {
    window.localStorage.clear();
    this.setState( {isAuthenticated: false});
  }

  handleUserFormSubmit(event)
  {
    event.preventDefault();
    const formType = window.location.href.split('/').reverse()[0];
    let data = {
      email: this.state.formData.email,
      password: this.state.formData.password,
    };
    if (formType === 'register') {
      data.username = this.state.formData.username;
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType}`
    axios.post(url, data)
    .then((res) => {
      console.log(res.data);
      this.clearFormState();
      window.localStorage.setItem('authToken', res.data.auth_token);
      this.setState({ isAuthenticated: true, });
      console.log('this.isAuthenticated=' + this.state.isAuthenticated);
      this.getUsers();
    })
    .catch((err) => { console.log(err); });
  };

  handleFormChange(event)
  {
    const obj = this.state.formData;
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };

  clearFormState() {
  this.setState({
    formData: { username: '', email: '', password: '' },
    username: '',
    email: ''
  });
};

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
      <div>
        <NavBar title={this.state.title} />
        <section className="section">
          <div className="container">
            <div className="columnns">
              <div className="column is-half">
                <br/>
                <Switch>
                  <Route exact path='/logout' render={() => (
                    <Logout
                      logoutUser={this.logoutUser}
                      isAuthenticated={this.state.isAuthenticated}
                    />
                  )} />
                  <Route exact path='/register' render={() => (
                    <Form
                      formType={'Register'}
                      formData={this.state.formData}
                      handleUserFormSubmit={this.handleUserFormSubmit}
                      handleFormChange={this.handleFormChange}
                      isAuthenticated={this.state.isAuthenticated}
                    />
                  )} />
                  <Route exact path='/login' render={() => (
                    <Form
                      formType={'Login'}
                      formData={this.state.formData}
                      handleUserFormSubmit={this.handleUserFormSubmit}
                      handleFormChange={this.handleFormChange}
                      isAuthenticated={this.state.isAuthenticated}
                    />
                  )} />
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
      </div>
    )
  }
}

export default App;