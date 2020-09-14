import Signup from '../Components/Login/Signup'
import { connect } from 'react-redux';
function mapReduxStateToReactProps(state){
  return {
    email:state.email
  }
}
function mapReduxDispatchToReactProps(){
  return {}
}
export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(Signup); 


/*
import React, { Component } from 'react';
import store from "../store"

// Signup이라는 component를 감싸는 component
export default class extends Component{
  state = {email: store.getState().email}
  constructor(props){
    super(props);
    store.subscribe(function(){
      this.setState({email:store.getState().email});
    }.bind(this))
  }

  render(){
    return <Signup email={this.state.email}></Signup>
  }
}
*/