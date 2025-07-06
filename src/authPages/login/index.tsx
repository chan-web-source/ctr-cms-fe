import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../context/useAuth';
import { useForm } from 'react-hook-form';
import style from './style.module.css';
import logo from '../../assets/logo.png';
import OTPInput from './otp';
import MFA from './mfa';
import { toast } from 'react-toastify';
import { loginMsgContext } from '../../context/handleMsg';
import commonStyles from '../../components/commonStyle.module.css';
import { ReactComponent as MyProfileIcon } from '../../assets/Icons/NavigationBar/My Profile - Default.svg';
import { ReactComponent as MultiFactorAuthenticationIcon } from '../../assets/Icons/login/Multi-Factor Authentication.svg';
import { ReactComponent as EnterVerficationCodeIcon } from '../../assets/Icons/login/Enter Verification Code.svg';

export const loginValidation = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  password: Yup.string()
    .min(3, 'Password must be at least 3 characters')
    // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    // .matches(/[0-9]/, "Password must contain at least one number")
    // .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    .required('Password is required'),
  otp: Yup.string().nullable(),
});

type MFAMethod = 'email' | 'phone';

type LoginFormsInputs = {
  email: string;
  password: string;
  otp?: number;
  method?: MFAMethod;
};

const Login = () => {
  const { loginUser, authOTP, sendOTP } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({ resolver: yupResolver(loginValidation) });

  const [otp, setOTP] = useState<string>('');
  // const [otpError, setOTPError] = useState<string>("");
  const [eventState, setEventState] = useState<string>('login'); //login, auth, mfa
  const [email, setEmail] = useState<string>('');
  const [jwt, setJWT] = useState<string>('');
  const [selectedMFAMethod, setSelectedMFAMethod] = useState<MFAMethod>('email'); //email | phone

  const handleLogin = async (form: LoginFormsInputs) => {
    try {
      const loginInfo = await loginUser(form.email, form.password);
      if (loginInfo?.mfa && loginInfo?.jwt) {
        setEmail(form.email);
        setJWT(loginInfo.jwt);
        setEventState('mfa');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleMFA = async () => {
    try {
      if (otp) {
        await authOTP(email, otp);
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      toast.error('Verification failed. Please try again.');
    }
  };

  const handleMFAMethodSelect = () => {
    // setMFAMethod(method);
  };

  const handleMFAMethod = async () => {
    try {
      await sendOTP(jwt, selectedMFAMethod);
      toast.success(loginMsgContext.login.sentOTP.notification);
      setEventState('auth');
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('Failed to send verification code. Please try again.');
    }
  };

  const getTitle = (eventState: string) => {
    if (eventState === 'login') {
      return 'Login to your account';
    } else if (eventState === 'auth') {
      return 'Enter Verfication Code';
    } else if (eventState === 'mfa') {
      return ' Multi-Factor Authentication';
    }
  };

  const getSubtitle = (eventState: string, email?: string) => {
    if (eventState === 'login') {
      return 'Secure sign-in to access your dashboard';
    } else if (eventState === 'auth' && selectedMFAMethod === 'email') {
      return `We've sent a code to ${email}`;
    } else if (eventState === 'auth' && selectedMFAMethod === 'phone') {
      return `We've sent a code to your phone.`;
    } else if (eventState === 'mfa') {
      return 'Please select your preferred Multi-Factor Authentication method';
    }
  };

  const getIcon = (eventState: string) => {
    if (eventState === 'login') {
      return (
        <MyProfileIcon
          height={64}
          width={64}
          className={style.userIcon}
          style={{ marginLeft: 0 }}
        />
      );
    } else if (eventState === 'mfa') {
      return (
        <MultiFactorAuthenticationIcon
          height={64}
          width={64}
          className={style.userIcon}
          style={{ marginLeft: 0 }}
        />
      );
    } else if (eventState === 'auth') {
      return (
        <EnterVerficationCodeIcon
          height={64}
          width={64}
          className={style.userIcon}
          style={{ marginLeft: 0 }}
        />
      );
    }
  };

  return (
    <section className={style.container}>
      <div className={style.wrapper}>
        <img src={logo} alt="Logo" className={style.logo} />
        <div className={style.formContainer}>
          <div className={commonStyles.iconWrapper}>
            <div className={commonStyles.innerIconWrapper}>{getIcon(eventState)}</div>
          </div>

          <h1 className={style.title}>{getTitle(eventState)}</h1>
          <p className={style.subtitle}>{getSubtitle(eventState, email)}</p>

          {eventState === 'login' && (
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className={style.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="text"
                  id="email"
                  placeholder="hello@isocul.com"
                  {...register('email')}
                />
                {errors.email && <p className={style.error}>{errors.email.message}</p>}
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && <p className={style.error}>{errors.password.message}</p>}
              </div>

              <div className={style.forgotPassword}>
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className={style.submitButton}>
                Login
              </button>
            </form>
          )}

          {eventState === 'auth' && (
            <div>
              <div className={style.otpInputGroup}>
                <OTPInput setOTP={setOTP} otp={otp} />
              </div>
              <button className={style.submitButton} onClick={handleMFA}>
                Verify
              </button>
              <div className={style.resendWrapper}>
                <p className={style.resendText}>{`Didn't receive the code?`}</p>
                <button onClick={handleMFAMethod} className={style.resendButton}>
                  Resend code
                </button>
              </div>
            </div>
          )}

          {eventState === 'mfa' && (
            <div className={style.mfaSection}>
              <MFA
                handleMFAMethod={handleMFAMethodSelect}
                selectedMFAMethod={selectedMFAMethod}
                setSelectedMFAMethod={setSelectedMFAMethod}
              />
              <button className={style.submitButton} onClick={handleMFAMethod}>
                Confirm
              </button>
            </div>
          )}
        </div>

        <p className={style.footer}>
          © 2025 All Rights Reserved. Securities Commission of Papua New Guinea
        </p>
      </div>

      <div className={`${style.rightContainer} ${commonStyles.borderRadius}`}>
        <h2 className={style.rightTitle}>P.C. Licensing.</h2>
        <h1 className={style.rightSubtitle}>
          Empowering Capital Formation with Fair and Secure Markets
        </h1>
        <div className={`${style.helpSection} ${style.bottomRight}`}>
          Having problems?{' '}
          <a href="mailto:help@scpng.gov.pg" className={style.contactLink}>
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Login;
