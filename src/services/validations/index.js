import { FlashAlert } from "../../components/flashMessage";

export const emailFormat =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const passwordFormat =
//     /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,24}$/   // just number/special chars
export const passwordFormat =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]).{8,10}$/; // all special chars
// /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,10}$/; // just one upper case alphabet/one lower case alpjhabet/number/special chars
export const nameFormat = /^[A-Za-z\s]+$/; // dont acccept special characters and numbers
export const nameFormat2 = /^[^\d]*$/; // dont accept numbers
export const timingsShifts = /^\d{2}(?:am|pm)$/i;
export const chekNumbers = /^[0-9]+$/;
const leadingSpaceCheck = /^\s/;

export const handleEmailCheck = (text, errors, setErrors, apiCall = false) => {
  const emailValue =
    text == ""
      ? "Email is Required"
      : emailFormat.test(text) || text === ""
      ? null
      : "Provide a valid Email address";
  setErrors({ ...errors, fieldName: "Email", email: emailValue });
  if (apiCall && emailValue != null) {
    FlashAlert("E", "Email", emailValue);
  }
  return emailValue === null;
};

export const handlePasswordCheck = (
  text,
  errors,
  setErrors,
  apiCall = false,
  confirmPassword = ""
) => {
  const passwordLengthError =
    text == ""
      ? "Password Field is Required"
      : !passwordFormat.test(text)
      ? "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 to 10 characters long"
      : null;

  const confirmPasswordError =
    confirmPassword !== text
      ? confirmPassword == ""
        ? null
        : "Passwords do not match with confirm password"
      : null;

  console.log("confirmPasswordError", confirmPasswordError);
  const passwordValue = passwordLengthError || confirmPasswordError;
  // const passwordValue = passwordLengthError;
  setErrors({ ...errors, fieldName: "Password", password: passwordValue });
  if (apiCall && passwordValue != null) {
    FlashAlert("E", "Password", passwordValue);
  }
  return passwordValue === null;
};

export const handleOldPasswordCheck = (
  text,
  errors,
  setErrors,
  apiCall = false
) => {
  const passwordLengthError =
    text == ""
      ? "Password Field is Required"
      : !passwordFormat.test(text)
      ? "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 to 10 characters long"
      : null;
  const passwordValue = passwordLengthError;
  setErrors({ ...errors, fieldName: "Password", oldPassword: passwordValue });
  if (apiCall && passwordValue != null) {
    FlashAlert("E", "Password", passwordValue);
  }
  return passwordValue === null;
};

export const handleConfirmPasswordCheck = (
  text,
  errors,
  setErrors,
  apiCall = false,
  password = ""
) => {
  const confirmPasswordLengthError =
    text == ""
      ? "Confirm password is Required"
      : // : text.length > 0 && text.length < 8
      // ? 'Password at least 8 characters long'
      text !== password
      ? "Password and confirm password not matched"
      : null;
  const confirmPasswordValue = confirmPasswordLengthError;
  setErrors({
    ...errors,
    fieldName: "Confirm Password",
    confirmPassword: confirmPasswordValue,
  });
  if (apiCall && confirmPasswordValue != null) {
    FlashAlert("E", "Confirm Password", confirmPasswordValue);
  }
  return confirmPasswordValue === null;
};

export const handleNewPasswordChange = (text, errors, setErrors) => {
  const passwordLengthError =
    text == ""
      ? "password Field is Required"
      : // text.length > 0 && text.length < 8
      // ? 'Password at least 8 characters long'
      !passwordFormat.test(text)
      ? "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 to 10 characters long"
      : null;
  const passwordValue = passwordLengthError;
  setErrors({
    ...errors,
    fieldName: "New Password",
    newPassword: passwordValue,
  });
  return passwordValue === null;
};

export const handleOTPCheck = (code, errors, setErrors, apiCall = false) => {
  const numberCheck = chekNumbers.test(code);
  const isTherAnyError =
    code?.length !== 6
      ? "Please Enter 6 digit otp here"
      : code !== "" && !numberCheck
      ? "You have put something wrong inside otp, You can just use numbers here from 1 to 9"
      : null;
  setErrors({ ...errors, fieldName: "OTP", otp: isTherAnyError });
  if (apiCall && isTherAnyError != null) {
    FlashAlert("E", "OTP", isTherAnyError);
  }
  return isTherAnyError === null;
};

export const handleAccountTypeCheck = (
  type,
  errors,
  setErrors,
  apiCall = false
) => {
  const isTherAnyError = type == "" ? "Please select account type first" : null;
  setErrors({ ...errors, fieldName: "Account Type", account: isTherAnyError });
  if (apiCall && isTherAnyError != null) {
    FlashAlert("E", "Account Type", isTherAnyError);
  }
  return isTherAnyError === null;
};

export const handleLocationCheck = (
  type,
  errors,
  setErrors,
  apiCall = false
) => {
  const isTherAnyError = type == "" ? "Please share your location" : null;
  setErrors({ ...errors, fieldName: "Account Type", location: isTherAnyError });
  if (apiCall && isTherAnyError != null) {
    FlashAlert("E", "Account Type", isTherAnyError);
  }
  return isTherAnyError === null;
};

export const handleTermsAndConditions = (
  cheked,
  errors,
  setErrors,
  apiCall = true
) => {
  const termsEror = cheked ? null : "Please select terms and conditions";
  setErrors({ ...errors, fieldName: "OTP", terms: termsEror });
  if (apiCall && termsEror) {
    FlashAlert("E", "Terms And Condition", termsEror);
  }
  return termsEror === null;
};

export const postCodeCheck = (postCode, errors, setErrors, apiCall = false) => {
  const numberCheck = chekNumbers.test(postCode);
  const isTherAnyError =
    postCode.length != 8
      ? "Please Enter 8 digit post code here"
      : postCode !== "" && !numberCheck
      ? "You have put something wrong inside post code, You can just use numbers here from 1 to 9"
      : null;
  setErrors({
    ...errors,
    fieldName: "Postcode",
    postcodeError: isTherAnyError,
  });
  if (apiCall && isTherAnyError != null) {
    FlashAlert("E", "OTP", isTherAnyError);
  }
  return isTherAnyError === null;
};

export const handleNameCheck = (name, errors, setErrors, apiCall = false) => {
  const numberCheck = nameFormat2.test(name);
  const hasLeadingSpace = leadingSpaceCheck.test(name);
  const isTherAnyError =
    name == ""
      ? "Name is Required"
      : hasLeadingSpace
      ? "Name cannot start with a space"
      : name?.length < 3
      ? "Name must be greater than 2 characters"
      : name?.length > 25
      ? "Character limit reached (25)"
      : name !== "" && !numberCheck
      ? "You cannot use numbers in the name"
      : null;

  setErrors({ ...errors, fieldName: "Name", name: isTherAnyError });
  if (apiCall && isTherAnyError != null) {
    FlashAlert("E", "Name", isTherAnyError);
  }
  return isTherAnyError === null;
};

export const chekPhoneNumber = (
  phone,
  errors,
  setErrors,
  phoneNumber,
  apiCall = false
) => {
  const checkValid = phone.current?.isValidNumber(phoneNumber);
  const checkValidPhoneError =
    phoneNumber == ""
      ? "Phone is required"
      : phoneNumber && !checkValid
      ? "Provide a Valid Phone number"
      : null;
  setErrors({
    ...errors,
    fieldName: "Phone",
    checkValidPhoneError: checkValidPhoneError,
  });
  if (apiCall && checkValidPhoneError !== null) {
    FlashAlert("E", "Number", checkValidPhoneError);
  }
  return checkValidPhoneError === null;
};

export const chekNumberValidation = (
  number,
  country,
  phone,
  errors,
  setErrors,
  apiCall = false
) => {
  const checkValid = phone?.current?.isValidNumber(number, country);
  const checkValidError = !checkValid ? "Provide a valid phone number" : null;
  console.log("checkValidError", checkValidError);
  setErrors({ ...errors, phoneNumber: checkValidError });
  if (apiCall && checkValidError != null) {
    FlashAlert("E", "Phone number", checkValidError);
    return false;
  }
  return true;
};

export const handleDOBCheck = (dob, errors, setErrors, apiCall = false) => {
  const dobFormat = /^\d{2}\/\d{2}\/\d{4}$/;
  const isEmpty = dob == "" ? "Date of Birth is required" : null;
  const isFormatInvalid =
    dob && !dobFormat.test(dob)
      ? "Please enter a valid date in DD/MM/YYYY format"
      : null;
  const dobError = isEmpty ?? isFormatInvalid;
  setErrors({
    ...errors,
    fieldName: "Date of Birth",
    dob: dobError,
  });
  if (apiCall && dobError) {
    FlashAlert("E", "Date of Birth", dobError);
  }

  return dobError === null;
};
