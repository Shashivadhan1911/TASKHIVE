import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUser();
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data,
          token: localStorage.getItem("token"),
        },
      });
    } catch (error) {
      console.error("Load user error:", error);
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await authAPI.login({ email, password });
      const { token, ...user } = response.data;

      localStorage.setItem("token", token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await authAPI.register({ name, email, password });
      const { token, ...user } = response.data;

      localStorage.setItem("token", token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
