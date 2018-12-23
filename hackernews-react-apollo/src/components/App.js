import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import LinkListContainer from './LinkListContainer';
import CreateLinkContainer from './CreateLinkContainer';
import Login from './Login';
import Search from './SearchDeclarative';

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path='/' render={() => <Redirect to='/new/1' />} />
            <Route path="/new/:page" component={LinkListContainer} />
            <Route path="/top" component={LinkListContainer} />
            <Route path="/create" component={CreateLinkContainer} />
            <Route path="/login" component={Login} />
            <Route path='/search' component={Search} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
