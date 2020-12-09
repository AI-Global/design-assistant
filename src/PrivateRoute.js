import React, { useState, useEffect } from "react";
import { getLoggedInUser } from './helper/AuthHelper';
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
    const [u, setUser] = useState('')

    useEffect(() => {
        getLoggedInUser().then(user => {
            setUser(user)
        })
    }, [])
    
    return (
        <Route
            {...rest}
            render={props =>
                u === '' ? null : (
                    u === undefined ? <Redirect to="/" /> :
                        (u.role === "admin" ||u.role === "superadmin" ) ? <Component {...props} /> : <Redirect to="/" /> 
                    )
            }
        />
    );
}

export default PrivateRoute;