import * as actionTypes from './actionTypes'

import axios from 'axios'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: authData.idToken,
        userId: authData.localId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime')
    localStorage.removeItem('userId')
    return {
        type: actionTypes.LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart())

        const authData = {
            email: email,
            password: password
        }

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAcmxTevk3HZZi91HO7cmbzOa-ce7D-WXw';

        if(!isSignup) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAcmxTevk3HZZi91HO7cmbzOa-ce7D-WXw';
        }

        axios.post(url, authData)
                    .then(response => {
                        const expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000)
                        localStorage.setItem('token', response.data.idToken);
                        localStorage.setItem('expirationTime', expirationTime);
                        localStorage.setItem('userId', response.data.localId)
                        dispatch(authSuccess(response.data))
                        dispatch(checkAuthTimeout(response.data.expiresIn))
                    })
                    .catch(err => {
                        dispatch(authFail(err.response.data.error))
                    })
        
    };
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {

        const token = localStorage.getItem('token');

        if(!token) {
            dispatch(logout())
        } else {
            const expirationTime = new Date(localStorage.getItem('expirationTime'));

            if(expirationTime < new Date()) {
                dispatch(logout())
            } else {
                const userId = localStorage.getItem('userId') 
                dispatch(authSuccess({idToken: token, localId: userId}))
                dispatch(checkAuthTimeout( (expirationTime.getTime() - new Date().getTime())/1000 
                        )                )
            }
            
        }
    }
}