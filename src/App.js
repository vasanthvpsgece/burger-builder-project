import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
//import Checkout from './containers/Checkout/Checkout'
//import Orders from './containers/Orders/Orders';
//import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout'
import {Redirect, Route, Switch, withRouter} from 'react-router-dom'
import asyncComponent from './redux-store/asyncComponent/asyncComponent'

import * as actions from './redux-store/actions/index'
import { connect } from 'react-redux';

const aysnCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout')
});

const aysnOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders')
});

const aysnAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth')
});

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignUp();
  }

  render() {

    let routes = (
          <Switch>
            <Route path="/auth" component={aysnAuth} />
            <Route path="/" component={BurgerBuilder} />
            <Redirect to="/" />
          </Switch>
    );

    if(this.props.isAuthenticated) {
      routes = (
          <Switch>
            <Route path="/checkout" component={aysnCheckout} />
            <Route path="/orders" component={aysnOrders} />
            <Route path="/logout" component={Logout} />
            <Route path="/auth" component={aysnAuth} />
            <Route path="/" component={BurgerBuilder} />
            <Redirect to="/" />
          </Switch>
      )
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
  
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));