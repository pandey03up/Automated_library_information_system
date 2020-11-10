import React from 'react';
import {Route,BrowserRouter as Router} from 'react-router-dom';

import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Profile from './Components/Profile/Profile';
import Admin from './Components/Admin/Admin';
import Search from './Components/Search/Search';

import './App.css';

function App() {
  return (
    <div>
      <Router>
        <Route path = '/' exact component = {Home} />
        <Route path = '/auth' exact component = {Login} />
        <Route path = '/profile' exact component = {Profile} />
        <Route path = '/admin' exact component = {Admin} />
        <Route path = '/books' exact component = {Search} />
      </Router>
    </div>
  );
}

export default App;
