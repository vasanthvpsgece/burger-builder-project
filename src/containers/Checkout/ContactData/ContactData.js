import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import classes from './ContactData.module.css'
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as burgerOrderActions from '../../../redux-store/actions/index'

import { updateObject, checkValidity } from '../../../shared/utilities'

import {connect} from 'react-redux'

class ContactData extends Component {

    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            }, 
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            }
        },
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        // this.setState({makingRequest: true})

        const formData = {};

        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId
        }

        this.props.onBurgerOrder(order, this.props.token)
        // axios.post('/orders.json', order)
        //     .then(response => {this.setState({makingRequest: false})
        //                         this.props.history.push('/')})
        //     .catch(error => {this.setState({makingRequest: false})});
        
    }

    inputChangeHandler = (event, inputIdentifier) => {
        // const updatedOrderForm = {
        //     ...this.state.orderForm
        // };

        // const updatedFormElement = {
        //     ...updatedOrderForm[inputIdentifier]
        // };

        // updatedFormElement.value = event.target.value;
        // updatedFormElement.valid = checkValidity(updatedFormElement.value, 
        //                                               updatedFormElement.validation)
        // updatedFormElement.touched = true;

        //updatedOrderForm[inputIdentifier] = updatedFormElement;

        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], 
                                                {value:event.target.value,
                                                 valid: checkValidity(event.target.value, 
                                                                           this.state.orderForm[inputIdentifier].validation),
                                                 touched: true})

        const updatedOrderForm = updateObject(this.state.orderForm, {[inputIdentifier]: updatedFormElement});

        let formIsValid = true;

        for(let inputElement in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputElement].valid && formIsValid;
        }

        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})
    }

    render() {

        let formElementArray = [];

        for(let key in this.state.orderForm) {
            formElementArray.push( {
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
            <form onSubmit={(event) => this.orderHandler(event)}>
                {formElementArray.map(formElement => (
                    <Input key={formElement.id}
                           elementType={formElement.config.elementType}
                           elementConfig={formElement.config.elementConfig}
                           value={formElement.config.value} 
                           shouldValidate={formElement.config.validation.required}
                           invalid={!formElement.config.valid}
                           touched={formElement.config.touched}
                           changed={(event) => this.inputChangeHandler(event, formElement.id)}/>
                                    )               )}
                <Button btnTyp="Success" disabled={!this.state.formIsValid}>Order</Button>
            </form>
        );

        if(this.props.makingRequest) {
             form = <Spinner />
        }

        return(
            <div className={classes.ContactData}>
                <h1>Enter your details</h1>
                {form}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return({
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.price,
        makingRequest: state.burgerOrder.makingRequest,
        token: state.auth.token,
        userId: state.auth.userId
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        onBurgerOrder: (orderData, token) => dispatch(burgerOrderActions.userPlacingOrder(orderData, token))
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));