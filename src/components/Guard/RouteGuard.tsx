import React from 'react';
import {Redirect, Route} from "react-router-dom";
import {useAuth} from '../../services/contexts/AuthContext/AuthContext';
import PropTypes from 'prop-types';

const RouteGuard: React.FC<any> = ({ children, ...rest }) => {
    const { currentUser } = useAuth();

    return (
        <Route {...rest}>
            {currentUser ? (children) : <Redirect to="/login" />}
        </Route>
    );
};

RouteGuard.propTypes = {
    children: PropTypes.node.isRequired
};

export default RouteGuard;
