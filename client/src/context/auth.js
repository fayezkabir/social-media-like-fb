import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";


const initialState = {
    user: null,
    getPostCounter : null
}

if (localStorage.getItem("jwtToken")) {
    const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("jwtToken");
    } else {
        initialState.user = decodedToken;
    }
}


const AuthContext = createContext({
    user: null,
    getPostCounter : null,
    login: (userData) => { },
    logout: () => { },
    updateCounter : () => {}
});


function AuthReducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload
            };
        case "LOGOUT":
            return {
                ...state,
                user: null
            }
            case "COUNT" :
                return {
                    ...state,
                    getPostCounter : action.payload
                }
        default: return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    function login(userData) {
        localStorage.setItem("jwtToken", userData.token)
        dispatch({
            type: "LOGIN",
            payload: userData
        })
    };

    function logout() {
        localStorage.removeItem("jwtToken");
        dispatch({ type: "LOGOUT" });
    };

    function updateCounter (data) { //this is just for an my context practice
        console.log("hitting")
        dispatch({
            type : "COUNT",
            payload: data
        })
    }

    return (
        <AuthContext.Provider value={{ user: state.user, login, logout , updateCounter, getPostCounter : state.getPostCounter}}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider };