import React, { useEffect, useState } from "react";
import AuthHandler from "../AuthHandler";

export const AuthState = {
  LOGIN: "login",
  SIGNUP: "signup",
  LOGGEDIN: "loggedin",
  SIGNOUT: "signout",
  FORGOT_PASSWORD: "forgotpassword",
};

export const AuthenticationContext = React.createContext();

const initialState = {
  authState: AuthState.LOGIN,
  currentUser: null,
};
const mockState = {
  authState: AuthState.LOGGEDIN,
  currentUser: { name: "pk" },
};
export const AuthenticationProvider = ({ children }) => {
  const [authentication, setAuthentication] = useState(initialState);
  //Get User From localStorage and set to the context
  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("userInfo");
    const userInfo = userFromLocalStorage
      ? JSON.parse(userFromLocalStorage)
      : {};
    setAuthentication({ ...authentication, ...userInfo });
  }, []);
  return (
    <AuthenticationContext.Provider
      value={{
        authState: authentication.authState,
        currentUser: authentication.currentUser,
        setAuthState: (state) =>
          setAuthentication({ ...authentication, authState: state }),
        setCurrentUser: (user) =>
          setAuthentication({ ...authentication, currentUser: user }),
        setAuthentication: (obj) =>
          setAuthentication({ ...authentication, ...obj }),
        logout: () => {
          setAuthentication(initialState);
          localStorage.removeItem("userInfo");
        },
        loginSuccess: (user, remeberme = true) => {
          setAuthentication({
            ...authentication,
            currentUser: user,
            authState: AuthState.LOGGEDIN,
          });
          if (remeberme) {
            const userInfo = {
              authState: AuthState.LOGGEDIN,
              currentUser: user,
            };
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
          }
        },
      }}
    >
      <AuthenticationContext.Consumer>
        {(authentication) => {
          AuthHandler.authentication = authentication;
          return children;
        }}
      </AuthenticationContext.Consumer>
    </AuthenticationContext.Provider>
  );
};
export const AuthenticationConsumer = AuthenticationContext.Consumer;