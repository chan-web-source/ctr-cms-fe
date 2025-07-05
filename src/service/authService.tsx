// API including Error handling
import axios from 'axios';
import { UserProfileToken } from '../types/user';
import { LoginAuthData } from '../types/userData';
import { loginMsgContext, commonMsgContext } from '../context/handleMsg';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../types/error';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const api = import.meta.env.VITE_API_BASE_URL || '';

const loginAPI = async (userData: LoginAuthData) => {
  try {
    const data = await axios.post<UserProfileToken>(
      api + 'auth/login',
      {
        email: userData.email,
        password: userData.password,
      },
      {
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const code = err.response?.data?.code;

    if (code === loginMsgContext.login.emailNotFound.code) {
      toast.error(loginMsgContext.login.emailNotFound.notification);
    } else if (code === loginMsgContext.login.invalidPassword.code) {
      toast.error(loginMsgContext.login.invalidPassword.notification);
    } else {
      toast.error(commonMsgContext.serverError.notification);
    }
  }
};

//send otp
const sendOTPAPI = async (userData: LoginAuthData) => {
  try {
    const data = await axios.post<UserProfileToken>(
      api + 'auth/send-otp',
      {
        method: userData.method,
        jwt: userData.jwt,
      },
      {
        headers: {
          ...headers,
          Authorization: `Bearer ${userData.jwt}`,
        },
      }
    );
    return data;
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const code = err.response?.data?.code;

    if (code === loginMsgContext.login.unableToSendPhoneOTP.code) {
      toast.error(loginMsgContext.login.unableToSendPhoneOTP.notification);
    } else {
      toast.error(commonMsgContext.serverError.notification);
    }
  }
};

// OTP authentication
const authOTPAPI = async (userData: LoginAuthData) => {
  try {
    const data = await axios.post<UserProfileToken>(
      api + 'auth/verify-otp',
      {
        email: userData.email,
        otp: userData.otp,
      },
      {
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    toast.success(loginMsgContext.login.success.notification);
    return data;
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const code = err.response?.data?.code;

    if (code === loginMsgContext.login.invalidOTP.code) {
      toast.error(loginMsgContext.login.invalidOTP.notification);
    } else {
      toast.error(commonMsgContext.serverError.notification);
    }
  }
};

const registerAPI = async (userData: LoginAuthData) => {
  try {
    const data = await axios.post<UserProfileToken>(api + 'account/register', {
      email: userData.email,
      password: userData.password,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export { loginAPI, sendOTPAPI, authOTPAPI, registerAPI };
