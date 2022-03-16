import React from 'react';
import {Redirect, Route} from "react-router-dom";
import PropTypes from 'prop-types';

const RouteGuard: React.FC<any> = ({ children, ...rest }) => {
    const userExists = localStorage.getItem("authKey");

    return (
        <Route {...rest}>
            {userExists ? (children) : <Redirect to="/login" />}
        </Route>
    );
};

RouteGuard.propTypes = {
    children: PropTypes.node.isRequired
};

export default RouteGuard;
