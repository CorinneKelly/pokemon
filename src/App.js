import React from 'react';
import './App.css';
import Home from './screens/Home'
import Pokemon from './screens/Pokemon'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/pokemon/:name' component={Pokemon} />
      </Switch>
    </Router>
  );
}

export default App;
