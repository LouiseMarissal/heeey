import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./useAuth";

// below : use of the rest parameter
/* 
@mdn : A function's last parameter can be prefixed with "..."
which will cause all remaining (user supplied) arguments to be placed within a "standard" javascript array. 
Only the last parameter can be a "rest parameter".
*/
export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return isLoggedIn ? (
    // pass all passed (rest) props(s) in a literal object to the Route
    <Route {...rest} render={props => <Component {...props} />} />
  ) : (
    <Redirect to="/login" />
  );
};
