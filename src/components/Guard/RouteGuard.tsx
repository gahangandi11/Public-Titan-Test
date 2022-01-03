import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, RouteProps} from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
    children: React.ReactNode
}

const RouteGuard: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
    const token = sessionStorage.getItem('Auth Token');
    return (
        token ? (<Route {...rest}>{children}</Route>) : (<Redirect to='/login' />)
    );
};

RouteGuard.propTypes = {
    children: PropTypes.node.isRequired
};

export default RouteGuard;
