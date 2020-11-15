import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
    const isAuthenticated = rest.location.state ? rest.location.state.userRole : false
    console.log(isAuthenticated)
    
    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                        <Redirect to="/" />
                    )
            }
        />
    );
}

export default PrivateRoute;