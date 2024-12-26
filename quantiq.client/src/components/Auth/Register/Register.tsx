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
import { Modal, Box, Typography } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';

import styles from "./Register.module.css";

interface RegisterProps {
  setNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
}

const Register: React.FC<RegisterProps> = ({ setNotification }) => {
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

  const [kvkkChecked, setKvkkChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [userAgreementChecked, setUserAgreementChecked] = useState(false);
  const [openKvkkModal, setOpenKvkkModal] = useState(false);
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  const [openUserAgreementModal, setOpenUserAgreementModal] = useState(false);

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
        setNotification({
          message: "Lütfen Turnstile doğrulamasını tamamlayın!",
          type: 'error'
        });
        return;
    }
    if (!allValidationsPassed) {
        setNotification({
          message: "Lütfen şifre gereksinimlerini düzeltin!",
          type: 'error'
        });
        return;
    }
    if (!kvkkChecked || !privacyChecked || !userAgreementChecked) {
        setNotification({
          message: "Lütfen tüm sözleşmeleri kabul ediniz!",
          type: 'error'
        });
        return;
    }

    try {
        const response = await fetch("api/Auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...registerData,
                hasConsentedKVKK: kvkkChecked,
                hasAcceptedPrivacyPolicy: privacyChecked,
                hasAcceptedUserAgreement: userAgreementChecked
            }),
        });

        if (response.ok) {
            setNotification({
              message: "Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz.",
              type: 'success'
            });
            navigate("/user/login");
        } else {
            setNotification({
              message: "Kayıt başarısız! Lütfen destek ile iletişime geçin.",
              type: 'error'
            });
        }
    } catch (error) {
        console.error("Registration error:", error);
        setNotification({
          message: "Kayıt sırasında bir hata oluştu.",
          type: 'error'
        });
    }
  };

  const preventCopyPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setNotification({
      message: "Güvenlik nedeniyle kopyalama/yapıştırma işlemi engellenmiştir.",
      type: 'error'
    });
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
                onCopy={preventCopyPaste}
                onPaste={preventCopyPaste}
                onCut={preventCopyPaste}
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
                onCopy={preventCopyPaste}
                onPaste={preventCopyPaste}
                onCut={preventCopyPaste}
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

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={kvkkChecked}
                    onChange={() => setKvkkChecked(false)}
                  />
                }
                label={
                  <Typography variant="body2">
                    <span 
                      style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
                      onClick={() => setOpenKvkkModal(true)}
                    >
                      KVKK Metnini
                    </span>
                    {' '}okudum ve kabul ediyorum
                  </Typography>
                }
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={privacyChecked}
                    onChange={() => setPrivacyChecked(false)}
                  />
                }
                label={
                  <Typography variant="body2">
                    <span 
                      style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
                      onClick={() => setOpenPrivacyModal(true)}
                    >
                      Gizlilik Sözleşmesini
                    </span>
                    {' '}okudum ve kabul ediyorum
                  </Typography>
                }
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userAgreementChecked}
                    onChange={() => setUserAgreementChecked(false)}
                  />
                }
                label={
                  <Typography variant="body2">
                    <span 
                      style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
                      onClick={() => setOpenUserAgreementModal(true)}
                    >
                      Kullanıcı Sözleşmesini
                    </span>
                    {' '}okudum ve kabul ediyorum
                  </Typography>
                }
              />
            </Box>

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

      <Modal
        open={openKvkkModal}
        onClose={() => setOpenKvkkModal(false)}
        aria-labelledby="kvkk-modal"
      >
        <Box className={styles.agreementModal}>
          <Typography variant="h6" className={styles.agreementContent}>
            <h2>KVKK Aydınlatma Metni</h2>
            
            <h3>1. Veri Sorumlusu</h3>
            <p>Quantiq ("Şirket") olarak kişisel verilerinizin güvenliği ve gizliliği konusuna önem veriyoruz.</p>

            <h3>2. Kişisel Verilerin İşlenme Amacı</h3>
            <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul>
              <li>Hizmetlerimizin sunulması ve geliştirilmesi</li>
              <li>Müşteri ilişkilerinin yönetimi</li>
              <li>Yasal yükümlülüklerimizin yerine getirilmesi</li>
              <li>Güvenlik ve dolandırıcılık önleme faaliyetleri</li>
            </ul>

            <h3>3. Kişisel Verilerin Aktarılması</h3>
            <p>Kişisel verileriniz, yasal yükümlülüklerimiz ve hizmet gerekliliklerimiz doğrultusunda üçüncü taraflarla paylaşılabilir.</p>

            <h3>4. Haklarınız</h3>
            <p>KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
            </ul>
          </Typography>
          <div className={styles.modalActions}>
            <button 
              className={styles.modalAcceptButton}
              onClick={() => {
                setKvkkChecked(true);
                setOpenKvkkModal(false);
              }}
            >
              Okudum ve Onaylıyorum
            </button>
            <button 
              className={styles.modalCloseButton} 
              onClick={() => setOpenKvkkModal(false)}
            >
              ✕
            </button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openPrivacyModal}
        onClose={() => setOpenPrivacyModal(false)}
        aria-labelledby="privacy-modal"
      >
        <Box className={styles.agreementModal}>
          <Typography variant="h6" className={styles.agreementContent}>
            <h2>Gizlilik Politikası</h2>
            
            <h3>1. Toplanan Bilgiler</h3>
            <p>Hizmetlerimizi kullanırken aşağıdaki bilgiler toplanabilir:</p>
            <ul>
              <li>Hesap bilgileri (ad, soyad, e-posta, telefon)</li>
              <li>Kullanım verileri</li>
              <li>Cihaz ve tarayıcı bilgileri</li>
              <li>Konum bilgileri</li>
            </ul>

            <h3>2. Çerezler ve Takip Teknolojileri</h3>
            <p>Hizmet kalitemizi artırmak için çerezler ve benzer teknolojiler kullanıyoruz.</p>

            <h3>3. Bilgi Güvenliği</h3>
            <p>Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz.</p>

            <h3>4. Üçüncü Taraf Hizmetler</h3>
            <p>Hizmetlerimizin bir parçası olarak üçüncü taraf hizmetlerinden yararlanabiliriz.</p>
          </Typography>
          <div className={styles.modalActions}>
            <button 
              className={styles.modalAcceptButton}
              onClick={() => {
                setPrivacyChecked(true);
                setOpenPrivacyModal(false);
              }}
            >
              Okudum ve Onaylıyorum
            </button>
            <button 
              className={styles.modalCloseButton} 
              onClick={() => setOpenPrivacyModal(false)}
            >
              ✕
            </button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openUserAgreementModal}
        onClose={() => setOpenUserAgreementModal(false)}
        aria-labelledby="user-agreement-modal"
      >
        <Box className={styles.agreementModal}>
          <Typography variant="h6" className={styles.agreementContent}>
            <h2>Kullanıcı Sözleşmesi</h2>
            
            <h3>1. Hizmet Kullanım Şartları</h3>
            <p>Bu platform üzerinden sunulan hizmetleri kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.</p>

            <h3>2. Kullanıcı Sorumlulukları</h3>
            <ul>
              <li>Hesap güvenliğini sağlamak</li>
              <li>Doğru ve güncel bilgi sağlamak</li>
              <li>Platformu yasal amaçlar için kullanmak</li>
              <li>Diğer kullanıcıların haklarına saygı göstermek</li>
            </ul>

            <h3>3. Fikri Mülkiyet</h3>
            <p>Platform üzerindeki tüm içerik ve materyaller şirketimizin fikri mülkiyetidir.</p>

            <h3>4. Hizmet Değişiklikleri</h3>
            <p>Şirketimiz, hizmetlerde değişiklik yapma hakkını saklı tutar.</p>

            <h3>5. Hesap Sonlandırma</h3>
            <p>Şirketimiz, kullanım şartlarının ihlali durumunda hesapları sonlandırma hakkına sahiptir.</p>
          </Typography>
          <div className={styles.modalActions}>
            <button 
              className={styles.modalAcceptButton}
              onClick={() => {
                setUserAgreementChecked(true);
                setOpenUserAgreementModal(false);
              }}
            >
              Okudum ve Onaylıyorum
            </button>
            <button 
              className={styles.modalCloseButton} 
              onClick={() => setOpenUserAgreementModal(false)}
            >
              ✕
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Register;
