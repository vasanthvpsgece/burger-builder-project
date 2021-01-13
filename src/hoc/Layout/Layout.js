import React, { Component } from 'react'
import classes from './Layout.module.css';
import Aux from '../Aux/Aux'; // HOC Container
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

class Layout extends Component {
    
    state = {
        showSideDrawer: false
    }

    sideDrawerClosed = () => {
        this.setState({showSideDrawer: false})
    }

    sideDrawerOpened = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    }

    render() {
        return (
            <Aux>
                <Toolbar clicked={this.sideDrawerOpened} />
                <SideDrawer open={this.state.showSideDrawer} clicked={this.sideDrawerClosed}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
}

export default Layout;