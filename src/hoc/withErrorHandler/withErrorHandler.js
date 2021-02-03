import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {

        state = {
            error: null
        }

        UNSAFE_componentWillMount() {
            //super(props);
            
            const reqInterceptorTemp = axios.interceptors.request.use(req => {
                this.setState({error: null})
                return req;
            })

            const resInterceptorTemp = axios.interceptors.response.use(res => res, 
                err => {
                    this.setState({error: err})
                })
            this.setState({reqInterceptor: reqInterceptorTemp, resInterceptor: resInterceptorTemp});
        }

        // componentDidMount() {
        //     console.log("Did Mount", WrappedComponent)
        // }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        clicked = () => {
            this.setState({error: null})
        }

       render() {
           return(
                <Aux>
                    <Modal show={this.state.error} modalClicked={this.clicked}>
                        {this.state.error? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
           )
       }
    }
}

export default withErrorHandler;