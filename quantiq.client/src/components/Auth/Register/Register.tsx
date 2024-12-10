import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from "react-router-dom";

import styles from "./Register.module.css";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    recaptchaToken: "",
    phoneNumber: "",
  });

  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    passwordMatch: false,
  });

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData({ ...registerData, [id]: value });

    if (id === "password") {
      const passwordValidations = validatePassword(value);
      setValidations({
        ...validations,
        ...passwordValidations,
        passwordMatch: value === registerData.confirmPassword,
      });
    }

    if (id === "confirmPassword") {
      setValidations({
        ...validations,
        passwordMatch: value === registerData.password,
      });
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRegisterData({ ...registerData, recaptchaToken: token || "" });
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setRegisterData({ ...registerData, phoneNumber });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allValidationsPassed = Object.values(validations).every(Boolean);

    if (!registerData.recaptchaToken) {
      alert("Please complete reCAPTCHA!");
      return;
    }
    if (!allValidationsPassed) {
      alert("Please fix the password requirements!");
      return;
    }

    try {
      const response = await fetch("api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        alert("Registration successful!");
        navigate("/user/login");
      } else {
        alert("Registration failed! Please contact support.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <h1 className={styles.formTitle}>Create an Account</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={registerData.name}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={registerData.email}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter a strong password"
                value={registerData.password}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
              <div className={styles.passwordRequirements}>
                <small 
                  className={validations.length ? styles.validRequirement : styles.invalidRequirement}
                >
                  ✓ At least 8 characters
                </small>
                <small 
                  className={validations.uppercase ? styles.validRequirement : styles.invalidRequirement}
                >
                  ✓ One uppercase letter
                </small>
                <small 
                  className={validations.lowercase ? styles.validRequirement : styles.invalidRequirement}
                >
                  ✓ One lowercase letter
                </small>
                <small 
                  className={validations.number ? styles.validRequirement : styles.invalidRequirement}
                >
                  ✓ One number
                </small>
                <small 
                  className={validations.specialChar ? styles.validRequirement : styles.invalidRequirement}
                >
                  ✓ One special character
                </small>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={registerData.confirmPassword}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
              {!validations.passwordMatch && registerData.confirmPassword && (
                <small className={styles.errorMessage}>
                  Passwords do not match
                </small>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>
                Telephone Number
              </label>
              <PhoneInput
                country={'tr'}
                value={registerData.phoneNumber}
                onChange={handlePhoneNumberChange}
                inputClass={styles.formInput}
                containerClass={styles.phoneInputContainer}
                inputProps={{
                  id: 'phoneNumber',
                  required: true,
                }}
              />
            </div>

            <ReCAPTCHA
              sitekey="6LfsbpQqAAAAAFji4WXnejrtEdI2WF2PY3TgIzy8"
              onChange={handleRecaptchaChange}
            />

            <button type="submit" className={styles.submitButton}>
              Register
            </button>
          </form>
        </div>
      </div>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerContent}>
          <h2>Welcome to Our Platform</h2>
          <p>
            Join thousands of users who trust us. Enjoy exclusive benefits and
            seamless experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;