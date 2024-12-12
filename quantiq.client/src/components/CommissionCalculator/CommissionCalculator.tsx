import React, { useState, useEffect } from "react";
import commissionData from "./data.json";
import platformData from "./platforms.json";
import styles from './CommissionCalculator.module.css'; // Import styles

interface Platform {
  name: string;
  logo: string;
}

interface CommissionRate {
  platform: string;
  category: string;
  commission: string;
}

const CommissionCalculator = () => {
  const [platform, setPlatform] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [salesPrice, setSalesPrice] = useState<string>("");
  const [buyingPrice, setBuyingPrice] = useState<string>("");
  const [kdv, setKdv] = useState<string>("");
  const [carryPrice, setCarryPrice] = useState<string>("");
  const [carryType, setCarryType] = useState<"seller" | "buyer">("seller");
  const [commission, setCommission] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [commissionRate, setCommissionRate] = useState<string | null>(null);

  const selectedPlatform = platformData.platforms.find(
    (item: Platform) => item.name === platform
  );

  useEffect(() => {
    if (platform) {
      const platformCommissions = commissionData.commissionRates.filter(
        (item: CommissionRate) =>
          item.platform.toLowerCase() === platform.toLowerCase()
      );
      setCategories(platformCommissions.map((item) => item.category));
      if (platformCommissions.length > 0) {
        setCategory(platformCommissions[0].category);
        setCommissionRate(platformCommissions[0].commission);
      }
    }
  }, [platform]);

  useEffect(() => {
    if (category && platform) {
      const commissionDataForCategory = commissionData.commissionRates.find(
        (item: CommissionRate) =>
          item.platform.toLowerCase() === platform.toLowerCase() &&
          item.category.toLowerCase() === category.toLowerCase()
      );
      if (commissionDataForCategory) {
        setCommissionRate(commissionDataForCategory.commission);
      }
    }
  }, [category, platform]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!platform || !category) {
      alert("Please select platform and category.");
      return;
    }

    const commissionPercentage = parseFloat(commissionRate || "0") / 100;
    const commissionAmount = parseFloat(salesPrice) * commissionPercentage;
    const kdvAmount = commissionAmount * (parseFloat(kdv) / 100);
    const carryCost = carryType === "seller" ? parseFloat(carryPrice) : 0;
    const totalCost = commissionAmount + kdvAmount + carryCost;

    setCommission(totalCost.toFixed(2));
  };

  return (
    <div className={styles.container}>
      <h1>
        {platform
          ? `${platform} Commission Calculator`
          : "Select a Platform"}
      </h1>

      <div className={styles.platformSwitch}>
        {platformData.platforms.map((item: Platform) => (
          <div
            key={item.name}
            className={`${styles.platformLogo} ${
              platform === item.name ? styles.selected : ""
            }`}
            onClick={() => setPlatform(item.name)}
          >
            <img
              src={item.logo}
              alt={`${item.name} logo`}
              style={{ height: "20px", width: "auto", marginRight: "8px" }}
            />
            {item.name}
          </div>
        ))}
      </div>

      {platform && (
        <form className={styles.commissionForm}>
          <div className={styles.formGroup}>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Product Sales Price</label>
            <input
              type="number"
              placeholder="Enter sales price"
              value={salesPrice}
              onChange={(e) => setSalesPrice(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Product Buying Price</label>
            <input
              type="number"
              placeholder="Enter buying price"
              value={buyingPrice}
              onChange={(e) => setBuyingPrice(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.smallInput}>
              <label>KDV (%)</label>
              <input
                type="number"
                placeholder="Enter KDV percentage"
                value={kdv}
                onChange={(e) => setKdv(e.target.value)}
              />
            </div>

            <div className={styles.smallInput}>
              <label>Carry Price</label>
              <input
                type="number"
                placeholder="Enter carry price"
                value={carryPrice}
                onChange={(e) => setCarryPrice(e.target.value)}
              />
            </div>

            <div className={styles.smallInput}>
              <label>Commission Rate</label>
              <input type="text" value={`${commissionRate || 0}%`} disabled />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Carry Type</label>
            <div className={styles.carryType}>
              <div
                className={`${styles.carryOption} ${
                  carryType === "seller" ? styles.selected : ""
                }`}
                onClick={() => setCarryType("seller")}
              >
                Seller
              </div>
              <div
                className={`${styles.carryOption} ${
                  carryType === "buyer" ? styles.selected : ""
                }`}
                onClick={() => setCarryType("buyer")}
              >
                Buyer
              </div>
            </div>
          </div>

          <button onClick={handleCalculate}>Calculate Commission</button>
          {commission && (
            <div className={styles.result}>Total Commission: {commission} ₺</div>
          )}
        </form>
      )}
    </div>
  );
};

export default CommissionCalculator;
