import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordRequirements from "../../Auth/Validation/PasswordValitadion";
import styles from "./ChangePassword.module.css";

interface ChangePasswordProps {
  setNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
}
const ChangePassword: React.FC<ChangePasswordProps> = ({ setNotification }) => {
  useEffect(() => {
    document.title = "Quantiq - E-Commerce Çözümleri - Şifre Değiştir";
  }, []);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validatePassword(newPassword)) {
      setNotification({
        message: "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.",
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setNotification({ message: "Yeni şifreler eşleşmiyor.", type: 'error' });
      setIsLoading(false);
      return;
    }

    const authToken = localStorage.getItem("auth_token");

    try {
      const response = await fetch("/api/Auth/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setNotification({ message: responseData.message || "Şifre başarıyla değiştirildi!", type: 'success' });
        navigate("/user/dashboard");
      } else {
        setNotification({ message: responseData.message || "Şifre değiştirme başarısız oldu. Lütfen tekrar deneyin.", type: 'error' });
      }
    } catch (error) {
      console.error("Change password error:", error);
      setNotification({ message: "Bir hata oluştu.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Şifre Değiştir</h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="currentPassword">Mevcut Şifre</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="newPassword">Yeni Şifre</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            required
          />
          <PasswordRequirements password={newPassword} />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="confirmNewPassword">Yeni Şifreyi Onayla</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            className={`${styles.button} ${isLoading ? styles.buttonLoading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'İşleniyor...' : 'Şifreyi Değiştir'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;