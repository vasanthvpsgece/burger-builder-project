import * as actionType from '../actions/actionTypes'
import { updateObject } from '../../shared/utilities'

const INGREDIENT_PRICE = {
    salad: 0.5,
    meat: 1.3,
    cheese: 0.8,
    bacon: 1
};

const initialState = {
    ingredients: null,
    price: 4,
    buildingBurger: false,
    error: false
}

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionType.ADD_ING:

            const newIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1};
            const updatedIngObject = updateObject(state.ingredients, newIngredient);
            const updatedStateObject = {
                ingredients: updatedIngObject,
                price: state.price + INGREDIENT_PRICE[action.ingredientName],
                buildingBurger: true
            }

            return updateObject(state, updatedStateObject);

        case actionType.REM_ING:
            const newIngredientRem = {[action.ingredientName]: state.ingredients[action.ingredientName] - 1};
            const updatedIngObjectRem = updateObject(state.ingredients, newIngredientRem);
            const updatedStateObjectRem = {
                ingredients: updatedIngObjectRem,
                price: state.price - INGREDIENT_PRICE[action.ingredientName],
            }

            return updateObject(state, updatedStateObjectRem);

        case actionType.SET_INIT_ING:

            return updateObject(state, {ingredients: action.ingredients, buildingBurger: false, error: false})
            // return({
            //     ...state,
            //     ingredients: action.ingredients,
            //     error: false
            // })
        case actionType.ING_FETCH_FAIL:
            return updateObject(state, {error: true})
            // return({
            //     ...state,
            //     error: true
            // })
        default:
            return state;
    }
}

export default reducer;