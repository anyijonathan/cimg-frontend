import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useApp } from "../utils/context/AppContext";
import {useDispatch, useSelector} from "react-redux"

function ProtectedRoute({ component: Component, ...restOfProps }) {


 // Get data from redux store
 let isAuthenticatedState = useSelector( (state) =>{
  return state["auth"]
 })

 let {isAuthenticated} = isAuthenticatedState

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
    
  );
}

export default ProtectedRoute;
