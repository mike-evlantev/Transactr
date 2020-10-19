import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
//import Footer from "./components/layout/Footer";
import Alerts from "./components/layout/Alerts";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/routing/PrivateRoute";
import './App.css';

import TransactionState from "./context/transaction/TransactionState";
import AuthState from "./context/auth/AuthState";
import AlertState from "./context/alert/AlertState";

import setAuthToken from "./utils/setAuthToken";
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  return (
    <AuthState>
      <TransactionState>
        <AlertState>
          <Router>
            <Fragment>
              <div className="page-container">
                <Navbar />
                <div className="container mt-5 content-wrap">
                  <Alerts />
                  <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                  </Switch>
                </div>
                {/*<Footer />*/}
              </div>
            </Fragment>
          </Router>
        </AlertState>
      </TransactionState>
    </AuthState>   
  );
}

export default App;
