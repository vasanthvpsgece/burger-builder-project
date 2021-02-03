import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BurgerControls from '../../components/BurgerControls/BurgerControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import { connect } from 'react-redux'
import * as actionCreators from '../../redux-store/actions/index'

class BurgerBuilder extends Component {

    state = {
        purchasing: false,
    }

    componentDidMount() {
        if(!this.props.ings) {
            this.props.initIngredient();
        }
        // axios.get('/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data})
        //     })
        //     .catch(error => {
        //         this.setState({error: error})
        //     });
    }

    updatePurchasableState = (ingredients) => {
        const newPurchasable = Object.keys(ingredients)
                                .map( igKey => (ingredients[igKey]))
                                .reduce((acc, cur) => (acc+cur), 0);

        return (newPurchasable > 0);
    }

    // addIngredientHandler = (type) => {

    //     const oldIngredientCount = this.state.ingredients[type];
    //     const newIngredientCount = oldIngredientCount + 1;
    //     const modifiedIngredientArray = this.state.ingredients;
    //     modifiedIngredientArray[type] = newIngredientCount;

    //     const priceIncrease = INGREDIENT_PRICE[type];
    //     const newPrice = this.state.totalPrice + priceIncrease;

    //     this.setState({ingredients: modifiedIngredientArray, 
    //                    totalPrice: newPrice});
    //     this.updatePurchasableState(modifiedIngredientArray);

    // }

    // removeIngredientHandler = (type) => {
    //     const oldIngredientCount = this.state.ingredients[type];

    //     if(oldIngredientCount === 0) {
    //         return;
    //     }

    //     const newIngredientCount = oldIngredientCount - 1;
    //     const modifiedIngredientArray = this.state.ingredients;
    //     modifiedIngredientArray[type] = newIngredientCount;

    //     const priceDecrease = INGREDIENT_PRICE[type];
    //     const newPrice = this.state.totalPrice - priceDecrease;

    //     this.setState({ingredients: modifiedIngredientArray, 
    //                    totalPrice: newPrice});
    //     this.updatePurchasableState(modifiedIngredientArray);
    // }

    orderNowHandler = () => {

        this.props.onInitPurchase();
        
        if(this.props.isAuthenticated) {
            this.setState({purchasing: true})
        } else {
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push("/auth");
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {

        // const queryParams = [];

        // for(let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + "=" + encodeURIComponent(this.state.ingredients[i]));
        // }

        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        
        this.props.history.push('/checkout');
    }

    render() {
        const disabledInfo = {...this.props.ings};
        let burger = this.props.error? <p>Error while retrieving Data</p> : <Spinner />;
        let orderSummary = null;

        if(this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BurgerControls less={this.props.onIngredientRemove} 
                                    more={this.props.onIngredientAdd} 
                                    disabled={disabledInfo}
                                    price={this.props.price}
                                    isAuthenticated={this.props.isAuthenticated}
                                    purchasable={this.updatePurchasableState(this.props.ings)}
                                    clicked={this.orderNowHandler}/>
                </Aux>
            );
            orderSummary = <OrderSummary ingredients={this.props.ings} 
                                            price={this.props.price}
                                            cancelBtn={this.purchaseCancelHandler}
                                            continueBtn={this.purchaseContinueHandler}/>;


        }

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClicked={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>

        );
    }
}

const mapStateToProps = (state) => {
    return({
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.price,
        error: state.burgerBuilder.error,
        token: state.auth.token,
        isAuthenticated: state.auth.token !== null
    })
}

const mapDispatchToProps = (dispatch) => {
    return({
        onIngredientAdd: (ingName) => dispatch(actionCreators.addIngredient(ingName)),
        onIngredientRemove: (ingName) => dispatch(actionCreators.removeIngredient(ingName)),
        initIngredient: () => dispatch(actionCreators.fetchIngredients()),
        onInitPurchase: () => dispatch(actionCreators.orderInit()),
        onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));