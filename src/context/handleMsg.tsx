// for toast notification error msg and server side error msg

const commonMsgContext = {
    serverError: {
        notification: "Server error occurred",
    }
}

const loginMsgContext = {
    login: {
        emailNotFound: {
            notification: "Email not found",
            msg: "could not execute find_user_by_email",
            code: 404
        },
        invalidPassword: {
            notification: "Invalid password",
            msg: "invalid password",
            code: 401
        },
        invalidOTP: {
            notification: "Invalid OTP",
            msg: "invalid OTP",
            code: 401
        },
        unableToSendPhoneOTP: {
            notification: "Unable to send OTP to phone, number unauthorized.",
            msg: "unable to send OTP to phone",
            code: 500
        },
        sentOTP: {
            notification: "OTP sent to email",
        },
        success: {
            notification: "Login successful",
        },
        expiredSession: {
            notification: "Session expired, please login again",
        }
    },
};

export { loginMsgContext, commonMsgContext }


