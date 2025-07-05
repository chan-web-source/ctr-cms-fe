// API handling and toast msg handling

import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../types/user";
import { useNavigate } from "react-router-dom";
import { authOTPAPI, loginAPI, registerAPI, sendOTPAPI } from "../service/authService";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import React from "react";
import axios from "axios";
import { LoginAuthData, LoginResponse } from "../types/userData";
import { checkExpiration } from "../utils/date";
import { loginMsgContext } from "./handleMsg";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  loginUser: (email: string, password: string) => Promise<LoginResponse | null>;
  authOTP: (email: string, otp: string) => void;
  sendOTP: (jwt: string, method: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  authTokenHandle: (jwt?: string) => DecodedInfo;
  getLocalToken: () => string | null;
};

type Props = { children: React.ReactNode };

interface DecodedInfo {
  firstName: string;
  surname: string;
  email: string;
  permissionIds: number[];
  roleIds: number[];
  exp?: number;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setToken(jwt);
      setUser({ token: jwt });  // Set minimal user object
      axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    email: string,
    password: string
  ) => {
    await registerAPI({ email, password })
      .catch((e) => {
        console.error('Registration error:', e);
      });
  };

  const loginUser = async (email: string, password: string): Promise<LoginResponse | null> => {
    try {
      const res = await loginAPI({ email, password });
      // save  token & navigate directly if mfa is false
      if (res?.data && res.data.mfa === false) {
        storeToken(res.data.jwt);
        authTokenHandle(res.data.jwt);
        toast.success(loginMsgContext.login.success.notification);
        setTimeout(() => {
          navigate("/user/management");
        }, 100);
      } else if (res?.data && res.data.mfa === true) {
        return {
          mfa: res.data.mfa,
          jwt: res.data.jwt
        };
      }
      return null;
    } catch (e) {
      console.error('Login error:', e);
      return null;
    }
  };


  const sendOTP = async (jwt: string, method: string) => {
    try {
      await sendOTPAPI({ jwt, method });
    } catch (e) {
      console.error('OTP authentication error:', e);
    }
  };

  // OTP authentication
  const authOTP = async (userData: LoginAuthData) => {
    try {
      const res = await authOTPAPI({ email: userData.email, otp: userData.otp });
      if (res?.data?.jwt) {
        authTokenHandle(res.data.jwt);
        storeToken(res.data.jwt);

        setTimeout(() => {
          navigate("/user/management");
        }, 100);
      }
    } catch (e) {
      console.error('OTP authentication error:', e);
    }
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const getLocalToken = () => {
    return localStorage.getItem("jwt") ?? null;
  }

  const authTokenHandle = (givenToken?: string) => {
    //   decode token, check if is within access time
    const token = givenToken ?? localStorage.getItem("jwt");
    const decodedToken: DecodedInfo = jwtDecode(token ?? "");

    // logout if token is expired
    const isExpired = checkExpiration(decodedToken?.exp ?? 0);
    if (isExpired) {
      toast.error(loginMsgContext.login.expiredSession.notification);
      logout();
    }

    return {
      firstName: decodedToken?.firstName,
      surname: decodedToken?.surname,
      email: decodedToken?.email,
      permissionIds: decodedToken?.permissionIds,
      roleIds: decodedToken?.roleIds,
    } as DecodedInfo;
  }


  const storeToken = (token: string) => {
    localStorage.setItem("jwt", token);
    setToken(token);
    setUser({ token: token });  // Set user when storing token
    localStorage.setItem("panel", "log");
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/login");
  };

  return (
    <UserContext.Provider
      value={{
        loginUser: (email: string, password: string) => loginUser(email, password),
        user,
        token,
        logout,
        isLoggedIn,
        registerUser,
        authTokenHandle,
        getLocalToken,
        authOTP: (email: string, otp: string) => authOTP({ email, otp }),
        sendOTP: (jwt: string, method: string) => sendOTP(jwt, method)
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);


