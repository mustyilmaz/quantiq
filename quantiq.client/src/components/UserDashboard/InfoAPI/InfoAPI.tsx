import React, { useState } from "react";
import styles from "./InfoAPI.module.css";

const InfoAPI = () => {
  const [apiInfo, setApiInfo] = useState({
    apiKey: "",
    apiSecret: "",
    sellerId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const tooltips = {
    apiKey:
      "API Key, platformla güvenli iletişim kurmanızı sağlayan benzersiz anahtardır.",
    apiSecret:
      "API Secret, isteklerinizi imzalamak ve güvenliği sağlamak için kullanılan gizli anahtardır.",
    sellerId: "Satıcı ID, platformdaki benzersiz satıcı kimliğinizdir.",
  };

  return (
    <div className={styles.container}>
      <h2>API Bilgileri</h2>
      <div className={styles.formGroup}>
        <label>
          API Key
          <div className={styles.tooltipContainer}>
            <span className={styles.tooltipIcon}>?</span>
            <span className={styles.tooltip}>{tooltips.apiKey}</span>
          </div>
        </label>
        <input
          type="text"
          name="apiKey"
          value={apiInfo.apiKey}
          onChange={handleInputChange}
          placeholder="API Key giriniz"
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          API Secret
          <div className={styles.tooltipContainer}>
            <span className={styles.tooltipIcon}>?</span>
            <span className={styles.tooltip}>{tooltips.apiSecret}</span>
          </div>
        </label>
        <input
          type="password"
          name="apiSecret"
          value={apiInfo.apiSecret}
          onChange={handleInputChange}
          placeholder="API Secret giriniz"
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          Satıcı ID
          <div className={styles.tooltipContainer}>
            <span className={styles.tooltipIcon}>?</span>
            <span className={styles.tooltip}>{tooltips.sellerId}</span>
          </div>
        </label>
        <input
          type="text"
          name="sellerId"
          value={apiInfo.sellerId}
          onChange={handleInputChange}
          placeholder="Satıcı ID giriniz"
        />
      </div>

      <button className={styles.saveButton}>Kaydet</button>
    </div>
  );
};

export default InfoAPI;
