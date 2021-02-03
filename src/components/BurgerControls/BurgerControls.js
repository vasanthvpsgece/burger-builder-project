import React from 'react'
import BurgerControl from './BurgerControl/BurgerControl';
import classes from './BurgerControls.module.css';
import PropTypes from 'prop-types';

const ingredientControls = [
    {label:"Meat", type:"meat"},
    {label:"Salad", type:"salad"},
    {label:"Bacon", type:"bacon"},
    {label:"Cheese", type:"cheese"}
];

const burgerControls = (props) => {
    
    const mapFunction = (ctrl) => (<BurgerControl key={ctrl.label} 
                                                 label={ctrl.label} 
                                                  more={() => props.more(ctrl.type)} 
                                                  less={() => props.less(ctrl.type)}
                                                  disabled={props.disabled[ctrl.type]} />);
    const burgerControlTags = ingredientControls.map(mapFunction);
    
    return (
    <div className={classes.BurgerControls}>
        <p>Burger Price: <strong>${props.price.toFixed(2)}</strong></p>
        {burgerControlTags}
        <button 
            className={classes.OrderButton} 
            disabled={!props.purchasable}
            onClick={props.clicked}>{props.isAuthenticated ? "Order" : "Sign Up"}</button>
    </div>
    )
}

ingredientControls.propTypes = {
    price: PropTypes.number,
    more: PropTypes.func,
    less: PropTypes.func,
    disabled: PropTypes.object
};

export default burgerControls;