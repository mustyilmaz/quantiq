import React, { useState, useEffect } from "react";
import Turnstile from "react-turnstile";
import {
  parsePhoneNumberWithError,
  getCountries,
  getCountryCallingCode,
  CountryCode,
  isValidPhoneNumber,
} from "libphonenumber-js";
import { useNavigate } from "react-router-dom";

import styles from "./Register.module.css";

const Register = () => {
  useEffect(() => {
    document.title = "Quantiq - E-Commerce Çözümleri - Kayıt Ol";
  }, []);
  const [registerData, setRegisterData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    turnstileToken: "",
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

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("TR");

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

  const handleTurnstileCallback = (token: string) => {
    setRegisterData({ ...registerData, turnstileToken: token });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    try {
      if (value) {
        const phoneNumberWithCountry = `+${getCountryCallingCode(
          selectedCountry
        )}${value}`;

        if (isValidPhoneNumber(phoneNumberWithCountry, selectedCountry)) {
          const phoneNumber = parsePhoneNumberWithError(phoneNumberWithCountry);

          setRegisterData((prev) => ({
            ...prev,
            phoneNumber: phoneNumber.format("E.164"),
          }));
        } else {
          setRegisterData((prev) => ({
            ...prev,
            phoneNumber: value,
          }));
        }
      }
    } catch (error) {
      console.error("Phone number parsing error:", error);
      setRegisterData((prev) => ({
        ...prev,
        phoneNumber: value,
      }));
    }
  };

  const isValidPhone = (phone: string): boolean => {
    try {
      return isValidPhoneNumber(phone, selectedCountry);
    } catch {
      return false;
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value as CountryCode);
  };

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allValidationsPassed = Object.values(validations).every(Boolean);

    if (!registerData.turnstileToken) {
      alert("Please complete Turnstile!");
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
          <div className={styles.footerLinks}>
            <p>
              Already have an account?{" "}
              <a href="/user/login" className={styles.loginLink}>
                Login
              </a>
            </p>
          </div>
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
              <label htmlFor="surname" className={styles.formLabel}>
                Surname
              </label>
              <input
                type="text"
                id="surname"
                placeholder="Enter your surname"
                value={registerData.surname}
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
                  className={
                    validations.length
                      ? styles.validRequirement
                      : styles.invalidRequirement
                  }
                >
                  ✓ At least 8 characters
                </small>
                <small
                  className={
                    validations.uppercase
                      ? styles.validRequirement
                      : styles.invalidRequirement
                  }
                >
                  ✓ One uppercase letter
                </small>
                <small
                  className={
                    validations.lowercase
                      ? styles.validRequirement
                      : styles.invalidRequirement
                  }
                >
                  ✓ One lowercase letter
                </small>
                <small
                  className={
                    validations.number
                      ? styles.validRequirement
                      : styles.invalidRequirement
                  }
                >
                  ✓ One number
                </small>
                <small
                  className={
                    validations.specialChar
                      ? styles.validRequirement
                      : styles.invalidRequirement
                  }
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
              <label htmlFor="phoneNumber" className={styles.formLabel}>
                Telefon Numarası
              </label>
              <div className={styles.phoneInputWrapper}>
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className={styles.countrySelect}
                >
                  {getCountries().map((country) => (
                    <option key={country} value={country}>
                      {country} (+{getCountryCallingCode(country)})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="5XX XXX XX XX"
                  value={registerData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className={styles.phoneInput}
                  required
                />
              </div>
              {registerData.phoneNumber &&
                !isValidPhone(registerData.phoneNumber) && (
                  <small className={styles.errorMessage}>
                    Geçerli bir telefon numarası giriniz
                  </small>
                )}
            </div>

            <Turnstile
              sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onVerify={handleTurnstileCallback}
              className={styles.turnstile}
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
