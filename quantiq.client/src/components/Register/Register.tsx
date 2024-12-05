import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from './Register.module.css';

const Register = () => {
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        recaptchaToken: ""
    })
    const [errors, setErrors] = useState({
        passwordMatch: false,
        passwordStrength: false
    })
    const validatePassword = (password: string) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongRegex.test(password);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRegisterData({ ...registerData, [id]: value });

        if (id === "password") {
            setErrors({
                ...errors,
                passwordStrength: !validatePassword(value),
            });
        }
        if (id === "confirmPassword") {
            setErrors({
                ...errors,
                passwordMatch: value !== registerData.password,
            });
        }
    };
    const handleRecaptchaChange = (token: string | null) => {
        setRegisterData({ ...registerData, recaptchaToken: token || "" });
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!registerData.recaptchaToken) {
            alert("Please complete reCAPTCHA!");
            return;
        }
        if (errors.passwordMatch || errors.passwordStrength) {
            alert("Please fix the password!");
            return;
        }
        const response = await fetch("api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registerData),
        });
        if (response.ok) {
            alert("Registration successful!");
        } else {
            alert("Registration failed! Please contact with us from here");
        }
    }

    return (
        <div className={styles.registerPage}>
            <div className={styles.formContainer}>
                <div className={styles.formWrapper}>
                    <h1 className={styles.formTitle}>Create an Account</h1>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label htmlFor="name" className={styles.formLabel}>Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            value={registerData.name}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            required
                        />

                        <label htmlFor="email" className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={registerData.email}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            required
                        />

                        <label htmlFor="password" className={styles.formLabel}>Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter a strong password"
                            value={registerData.password}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            required
                        />
                        {errors.passwordStrength && (
                            <small className={styles.errorMessage}>Password must include uppercase, lowercase, number, special character, and be 8+ characters.</small>
                        )}

                        <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            value={registerData.confirmPassword}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            required
                        />
                        {errors.passwordMatch && <small className={styles.errorMessage}>Passwords do not match.</small>}

                        <ReCAPTCHA
                            sitekey="6LdYdJIpAAAAACdHw2Hipmtpk0U7nzv0hhtIHXmb"
                            onChange={handleRecaptchaChange}
                        />

                        <button type="submit" className={styles.submitButton}>Register</button>
                    </form>
                </div>
            </div>
            <div className={styles.bannerContainer}>
                <div className={styles.bannerContent}>
                    <h2>Welcome to Our Platform</h2>
                    <p>Join thousands of users who trust us. Enjoy exclusive benefits and seamless experiences.</p>
                </div>
            </div>
        </div>
    );
}

export default Register;