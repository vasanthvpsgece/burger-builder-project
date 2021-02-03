import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utilities'

const initialState = {
    orders: [],
    makingRequest: false,
    purchased: true
}

const reducer = (state = initialState, action) => {

    switch(action.type) {
        case actionTypes.ORD_SUCCESS:

            const newOrder = updateObject(action, {id: action.orderId});

            return updateObject(state, {makingRequest: false,
                                        purchased: true,
                                        orders: state.orders.concat(newOrder)})
                                        
            // const newOrder = {
            //     ...action.orderData,
            //     orderId: action.orderId,
            // }

            // return ({
            //     ...state,
            //     makingRequest: false,
            //     purchased: true,
            //     orders: state.orders.concat(newOrder)
            // })
        case actionTypes.ORD_FAILURE:

            return updateObject(state, {makingRequest: false})
            // return ({
            //     ...state,
            //     makingRequest: false
            // })
        case actionTypes.ORD_PLACE_START:
            return updateObject(state, {makingRequest: true})
            // return ({
            //     ...state,
            //     makingRequest: true
            // })
        case actionTypes.ORD_INIT:
            return updateObject(state, {purchased: false})
            // return ({
            //     ...state,
            //     purchased: false
            // })
        case actionTypes.FETCH_ORD_START:
            return updateObject(state, {makingRequest: true})
            // return ({
            //     ...state,
            //     makingRequest: true
            // })
        case actionTypes.FETCH_ORD_SUCCESS:
            return updateObject(state, {orders: action.orders, makingRequest: false})
            // return ({
            //     ...state,
            //     orders: action.orders,
            //     makingRequest: false
            // })
        case actionTypes.FETCH_ORD_FAIL:
            return updateObject(state, {makingRequest: false})
            // return ({
            //     ...state,
            //     makingRequest: false
            // })
        default:
            return state;
    }
}

export default reducer