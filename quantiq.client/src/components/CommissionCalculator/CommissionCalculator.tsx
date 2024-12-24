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
  productgroup: string;
  vade: number;
  commission: number;
  level5_commission: number | null;
  level4_commission: number | null;
  special_group_commission: number | null;
  women_entrepreneur_commission: number | null;
  brand: string;
  brand_category_commission: number | null;
  level5_brand_commission: number | null;
  level4_brand_commission: number | null;
}


const CommissionCalculator = () => {
  const [platform, setPlatform] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [productGroups, setProductGroups] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [salesPrice, setSalesPrice] = useState<string>("");
  const [buyingPrice, setBuyingPrice] = useState<string>("");
  const [kdv, setKdv] = useState<string>("");
  const [carryPrice, setCarryPrice] = useState<string>("");
  const [carryType, setCarryType] = useState<"seller" | "buyer">("seller");
  const [commissionRate, setCommissionRate] = useState<string | null>(null);
  const [level5BrandCommission, setLevel5BrandCommission] = useState<number | null>(null);
  const [level4BrandCommission, setLevel4BrandCommission] = useState<number | null>(null);
  const [commission, setCommission] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const [returnOnInvestment, setReturnOnInvestment] = useState<number | null>(null);
  const [serviceFee, setServiceFee] = useState<number | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const [kdvAmount, setKdvAmount] = useState<number | null>(null);
  const [commissionAmount, setCommissionAmount] = useState<number | null>(null);


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
        setCommissionRate(platformCommissions[0].commission.toString());
      }
    }
  }, [platform]);

useEffect(() => {
  if (category && platform) {
    // Seçilen kategoriye göre commission verilerini filtrele
    const commissionDataForCategory = commissionData.commissionRates.find(
      (item: CommissionRate) =>
        item.platform.toLowerCase() === platform.toLowerCase() &&
        item.category.toLowerCase() === category.toLowerCase()
    );

    if (commissionDataForCategory) {
      // Marka listesini sadece seçilen kategoriye göre filtrele
      const brandList = commissionDataForCategory.brand
        ? commissionDataForCategory.brand.split(",").map((b) => b.trim())
        : [];
      setBrands(brandList);
      
      // Markaları ve diğer verileri güncelle
      setProductGroups(
        commissionDataForCategory.productgroup
          ? commissionDataForCategory.productgroup
              .split(",")
              .map((g) => g.trim())
          : []
      );
      
      setCommissionRate(commissionDataForCategory.commission.toString());
      setLevel5BrandCommission(commissionDataForCategory.level5_brand_commission || null);
      setLevel4BrandCommission(commissionDataForCategory.level4_brand_commission || null);
    }
  }
}, [category, platform]); // category veya platform değiştiğinde bu effect çalışır


  useEffect(() => {
    setPlatform('trendyol');
    if (platform) {
      const platformCommissions = commissionData.commissionRates.filter(
        (item: CommissionRate) =>
          item.platform.toLowerCase() === platform.toLowerCase()
      );
  
      const uniqueCategories = Array.from(
        new Set(platformCommissions.map((item) => item.category))
      );
  
      setCategories(uniqueCategories);
  
      if (platformCommissions.length > 0) {
        setCategory(uniqueCategories[0]); // Benzersiz kategorilerden ilkini seçiyoruz
        setCommissionRate(platformCommissions[0].commission.toString());
      }
    }
  }, [platform]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!platform || !category) {
      alert("Please select platform and category.");
      return;
    }

    const baseCommission = parseFloat(commissionRate || "0") / 100;
    const level5Commission = level5BrandCommission !== null ? level5BrandCommission / 100 : 0;
    const level4Commission = level4BrandCommission !== null ? level4BrandCommission / 100 : 0;
    const adjustedCommissionRate =
      selectedBrand && level5BrandCommission
        ? level5Commission
        : selectedBrand && level4BrandCommission
        ? level4Commission
        : baseCommission;
  
    const commissionAmount = parseFloat(salesPrice) * adjustedCommissionRate;
    const kdvAmount = commissionAmount * (parseFloat(kdv) / 100);
    const carryCost = carryType === "seller" ? parseFloat(carryPrice) : 0;
  
    // Hesaplamaları yapmak için metrikleri güncelle
    const totalCost = commissionAmount + kdvAmount + carryCost;
  
    // Diğer metrikler için hesaplamalar
    const totalInvestment = parseFloat(buyingPrice) + carryCost;
    const profit = parseFloat(salesPrice) - totalCost;
    const roi = profit / totalInvestment;
    const serviceFee = carryCost; // Hizmet bedeli olarak kargo bedeli veya farklı harcama olabilir
    setCommissionAmount(totalCost);
    setReturnOnInvestment(roi);
    setServiceFee(serviceFee);
    setProfit(profit);
    setKdvAmount(kdvAmount);
    
  };
  
  return (
    <div className={styles.container}>
      <h1>
        {platform
          ? `${platform} Komisyon Hesaplama Aracı`
          : "Lütfen Platform Seçiniz..."}
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
            <label>Kategori</label>
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

          {productGroups.length > 0 && (
            <div className={styles.formGroup}>
              <label>Ürün Grubu</label>
              <select>
                {productGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          )}

          {brands.length > 0 && (
            <div className={styles.formGroup}>
              <label>Marka</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Satış Fiyatı</label>
            <input
              className={styles.inputtl}
              type="number"
              placeholder="0"
              value={salesPrice}
              onChange={(e) => setSalesPrice(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Alış Fiyatı</label>
            <input
              type="number"
              placeholder="0"
              value={buyingPrice}
              onChange={(e) => setBuyingPrice(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.smallInput}>
              <label>KDV (%)</label>
              <input
                type="number"
                placeholder="%20"
                value={kdv}
                onChange={(e) => setKdv(e.target.value)}
              />
            </div>

            <div className={styles.smallInput}>
              <label>Kargo Fiyatı</label>
              <input
                type="number"
                placeholder="Kargo ücreti giriniz..."
                value={carryPrice}
                onChange={(e) => setCarryPrice(e.target.value)}
              />
            </div>

            <div className={styles.smallInput}>
              <label>Komisyon Oranı</label>
              <input type="text" value={`${commissionRate || 0}%`} disabled />
            </div>
          </div>

          <div className={styles.formGroup}>
  <div className={styles.carryType}>
    <div
      className={`${styles.carryOption} ${
        carryType === "seller" ? styles.selected : ""
      }`}
      onClick={() => setCarryType("seller")}
    >
      <input
        type="radio"
        name="carryType"
        value="seller"
        checked={carryType === "seller"}
        readOnly
      />
      Kargoyu Satıcı Öder
    </div>
    <div
      className={`${styles.carryOption} ${
        carryType === "buyer" ? styles.selected : ""
      }`}
      onClick={() => setCarryType("buyer")}
    >
      <input
        type="radio"
        name="carryType"
        value="buyer"
        checked={carryType === "buyer"}
        readOnly
      />
      Kargoyu Alıcı Öder
    </div>
  </div>
</div>


          <button onClick={handleCalculate}>Hesapla</button>
          {commissionAmount && (
            <div className={styles.result}>
            <p>Komisyon: {(commissionAmount ?? 0).toFixed(2)} ₺</p>
            <p>Yatırım Geri Dönüş Oranı: {returnOnInvestment}</p>
            <p>Hizmet Bedeli: {serviceFee} ₺</p>
            <p>Kâr Oranı: {(profit ?? 0).toFixed(2)}</p>
            <p>KDV Oranı: {kdv}</p>
            <p>Satıştan Oluşan KDV: {(kdvAmount ?? 0).toFixed(2)} ₺</p>
            <p>Alıştan Oluşan KDV: {buyingPrice ? (parseFloat(buyingPrice) * (parseFloat(kdv) / 100)).toFixed(2) : '0'} ₺</p>
            <p>Kargodan Oluşan KDV: {carryType === "seller" ? carryPrice && (parseFloat(carryPrice) * (parseFloat(kdv) / 100)).toFixed(2) : '0'} ₺</p>
            <p>Komisyondan Oluşan KDV: {(commissionAmount ?? 0 * (parseFloat(kdv) / 100)).toFixed(2)} ₺</p>
            <p>Hizmet Bedelinden Oluşan KDV: {(serviceFee && kdv) ? (serviceFee * (parseFloat(kdv) / 100)).toFixed(2).toString() : '0'} ₺</p>
            <p>Ödenecek KDV: {(kdvAmount ?? 0).toFixed(2)} ₺</p>
          </div>
          )}
        </form>
      )}
    </div>
  );
};

export default CommissionCalculator;
