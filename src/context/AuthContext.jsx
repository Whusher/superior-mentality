import React, { createContext, useReducer, useMemo, useEffect } from "react";
import { AuthEndpoint, ResetEndpoint } from "../utils/EndpointExporter";

const AuthContext = createContext();
export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "SIGN_IN":
          return {
            ...prevState,
            userToken: action.token,
            isSignOut: false,
            nameUser: action.name,
            emailUser: action.email,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            userToken: null,
            emailUser: null,
            nameUser: null,
            isSignOut: true,
          };
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        default:
          return prevState;
      }
    },
    {
      userToken: null,
      nameUser: null,
      emailUser: null,
      isSignOut: false,
      isLoading: true,
    }
  );

  const signIn = async (loginData) => {
    try {
      const response = await fetch(`${AuthEndpoint}/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userToken", true);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);
        dispatch({
          type: "SIGN_IN",
          token: true,
          email: data.email,
          name: data.name,
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
  };

  const signOut = async () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    dispatch({ type: "SIGN_OUT" });
    const res = await fetch(`${ResetEndpoint}/clearcookies`, {
      method: "GET",
    });
    return res.ok;
  };

  useEffect(() => {
    const restoreToken = () => {
      const token = localStorage.getItem("userToken");
      const name = localStorage.getItem("userName");
      const email = localStorage.getItem("userEmail");
      if (token && email) {
        dispatch({
          type: "RESTORE_TOKEN",
          token: true,
        });
        dispatch({
          type: "SIGN_IN",
          token: true,
          name,
          email,
        });
      }
    };
    restoreToken();
  }, []);

  const authContext = useMemo(
    () => ({
      state,
      signIn,
      signOut,
    }),
    [state.userToken, state.emailUser, state.nameUser]
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
