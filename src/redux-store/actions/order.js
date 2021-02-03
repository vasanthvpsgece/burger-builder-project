import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'

export const orderSuccess = (orderId, orderData) => {
    return {
        type: actionTypes.ORD_SUCCESS,
        orderId: orderId,
        orderData: orderData
    }
}

export const orderFailure = (error) => {
    return {
        type: actionTypes.ORD_FAILURE,
        error: error
    }
}

export const orderPlacingStart = () => {
    return {
        type: actionTypes.ORD_PLACE_START
    }
}

export const userPlacingOrder = (orderData, token) => {
    return dispatch => {
        
        dispatch(orderPlacingStart());
        axios.post('/orders.json?auth=' + token, orderData)
            .then(response => {
                                dispatch(orderSuccess(response.data.name, orderData))
                              })
            .catch(error => { 
                                dispatch(orderFailure(error))
                            });
    }
}

export const orderInit = () => {
    return ({
        type: actionTypes.ORD_INIT
    })
}

export const fetchOrderSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORD_SUCCESS,
        orders: orders
    }
}

export const fetchOrderFail = (error) => {
    return {
        type: actionTypes.FETCH_ORD_FAIL,
        error: error
    }
}

export const fetchOrderStart = () => {
    return {
        type: actionTypes.FETCH_ORD_START
    }
}

export const fetchOrders = (token, userId) => {
    return (dispatch) => {
        dispatch(fetchOrderStart());

        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
        axios.get('/orders.json' + queryParams)
        .then(res => {
            let fetchedOrders = [];
            for(let key in res.data) {
                fetchedOrders.push({...res.data[key], id: key});
            }
            dispatch(fetchOrderSuccess(fetchedOrders))
        })
        .catch(error => {
            dispatch(fetchOrderFail(error))
        })
    }
}