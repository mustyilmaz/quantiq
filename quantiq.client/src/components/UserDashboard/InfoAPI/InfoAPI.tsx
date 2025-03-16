import React, { useEffect, useState } from "react";
import styles from "./InfoAPI.module.css";
import { useAuth } from "../../../hooks/useAuth";


const InfoAPI = () => {
  useEffect(() => {
    document.title = "Quantiq - E-Commerce Çözümleri - API Bilgileri";
  }, []);
  const [apiInfo, setApiInfo] = useState({
    apiKey: "",
    apiSecret: "",
    sellerId: "",
  });
  const auth = useAuth();
  const userId = auth?.user?.id;

  const [hasApiInfo, setHasApiInfo] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);

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

  const saveApiInfo = async () => {
    try {
      if (!apiInfo.apiKey || !apiInfo.apiSecret || !apiInfo.sellerId) {
        throw new Error("Tüm alanları doldurunuz");
      }

      console.log("Sending data:", {
        UserId: userId,
        Apikey: apiInfo.apiKey.trim(),
        SuppleirId: apiInfo.sellerId.trim(),
        SecretApikey: apiInfo.apiSecret.trim(),
      });

      const response = await fetch("/api/Auth/save-api-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserId: userId, 
          Apikey: apiInfo.apiKey.trim(), 
          SuppleirId: apiInfo.sellerId.trim(), 
          SecretApikey: apiInfo.apiSecret.trim(),
        }),
      });

      if (response.ok) {
        alert("API information saved successfully");
        setHasApiInfo(true);
      } else {
        alert("Failed to save API information");
      }
    } catch (error) {
      console.error("Error saving API info:", error);
      alert("Failed to save API information");
    }
  };

  const updateApiInfo = async () => {
    try {
      const response = await fetch("/api/Auth/update-api-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserId: userId, 
          Apikey: apiInfo.apiKey.trim(), 
          SuppleirId: apiInfo.sellerId.trim(), 
          SecretApikey: apiInfo.apiSecret.trim(),
        }),
      });

      if (response.ok) {
        alert("API information updated successfully");
      } else {
        alert("Failed to update API information");
      }
    } catch (error) {
      console.error("Error updating API info:", error);
      alert("Failed to update API information");
    }
  };

  const fetchApiInfo = async () => {
    try {
      const response = await fetch(`/api/Auth/get-api-info/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setApiInfo({
          apiKey: data.apikey || "",
          apiSecret: data.secretApikey || "",
          sellerId: data.suppleirId || "",
        });
        setHasApiInfo(true);
      } else {
        console.error("Failed to fetch API information");
      }
    } catch (error) {
      console.error("Error fetching API information:", error);
    }
  };

  useEffect(() => {
    if (userId !== null) {
      fetchApiInfo();
    }
  }, [userId]);

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
        <div className={styles.inputContainer}>
          <input
            type={showApiKey ? "text" : "password"}
            name="apiKey"
            value={apiInfo.apiKey}
            onChange={handleInputChange}
            placeholder="API Key giriniz"
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>
          API Secret
          <div className={styles.tooltipContainer}>
            <span className={styles.tooltipIcon}>?</span>
            <span className={styles.tooltip}>{tooltips.apiSecret}</span>
          </div>
        </label>
        <div className={styles.inputContainer}>
          <input
            type={showApiSecret ? "text" : "password"}
            name="apiSecret"
            value={apiInfo.apiSecret}
            onChange={handleInputChange}
            placeholder="API Secret giriniz"
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowApiSecret(!showApiSecret)}
          >
            {showApiSecret ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
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

      {hasApiInfo ? (
        <button className={styles.saveButton} onClick={updateApiInfo}>
          Güncelle
        </button>
      ) : (
        <button className={styles.saveButton} onClick={saveApiInfo}>
          Kaydet
        </button>
      )}
    </div>
  );
};

export default InfoAPI;
