import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class App extends Component
{
  constructor()
  {
    super();
    this.state = {
      users: []
    };
  }

  // 'componentDidMount' will make the method call when Ajax is completed mounting the app
  // https://pbs.twimg.com/media/DZ-97vzW4AAbcZj.jpg:large
  componentDidMount()
  {
    this.getUsers();
  }

  render()
  {
    return (
      <section className="section">
        <div className="container">
          <div className="columnns">
            <div className="column is-one-third">
              <br/>
              <h1 className="title is-1 is-1">All Users</h1>
              <hr/><br/>
              {
                this.state.users.map((user) => {
                  return (
                    <h4
                      key={user.id}
                      className="box title is-4"
                      >{ user.username }
                    </h4>
                  )
                })
              }
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