import { createContext, useContext, useReducer, useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 React main context
const userContext = createContext();

// Setting custom name for the context which is visible on react dev tools
userContext.displayName = "MaterialUIContext";

// Material Dashboard 2 React reducer
function reducer(state, action) {
    switch (action.type) {
        case "USERNAME": {
            return { ...state, username: action.value };
        }
        case "LOGIN": {
            return { ...state, login: action.value };
        }
        case "ACCESS": {
            return { ...state, access: action.value };
        }
        case "REFRESH-ACCESS": {
            return { ...state, refresh_access: action.value };
        }
        case "ADMIN": {
            return { ...state, admin: action.value };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

// Material Dashboard 2 React context provider
function UserControllerProvider({ children }) {
    const initialState = {
        username: "",
        login: false,
        access: "",
        refresh_access: "",
        admin: false,
    };

    const [controller, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

    return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

// Material Dashboard 2 React custom hook for using context
function useUserController() {
    const context = useContext(userContext);

    if (!context) {
        throw new Error(
            "useMaterialUIController should be used inside the MaterialUIControllerProvider."
        );
    }

    return context;
}

// Typechecking props for the MaterialUIControllerProvider
UserControllerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Context module functions
const setUsername = (dispatch, value) => dispatch({ type: "USERNAME", value });
const setLogin = (dispatch, value) => dispatch({ type: "LOGIN", value });
const setAccess = (dispatch, value) => dispatch({ type: "ACCESS", value });
const setRefreshAccess = (dispatch, value) => dispatch({ type: "REFRESH-ACCESS", value });
const setAdmin = (dispatch, value) => dispatch({ type: "ADMIN", value });

export {
    UserControllerProvider,
    useUserController,
    setUsername,
    setLogin,
    setAccess,
    setRefreshAccess,
    setAdmin,
};