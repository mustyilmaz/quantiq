import { useEffect, useState } from "react";
import styles from "./UserHome.module.css";
import { authService } from "../../../services/auth.service";


type PackageType = 0 | 1 | 2;

interface UserInfo {
  success: boolean;
  user: {
    id: string | undefined;
    name: string;
    email: string;
    phoneNumber: string;
    isEmailVerified: boolean;
    isPhoneNumberVerified: boolean;
    isProfileRestricted: boolean;
    package: PackageType;
  } | null;
}

const PackageInfo = ({ packageType }: { packageType: PackageType }) => {
  const getPackageInfo = () => {
    switch (packageType) {
      case 0:
        return {
          label: "Free",
          className: styles.freePlan,
        };
      case 1:
        return {
          label: "Pro1",
          className: styles.proPlan1,
        };
      case 2:
        return {
          label: "Pro2",
          className: styles.proPlan2,
        };
      default:
        return {
          label: "Error",
          className: styles.freePlan,
        };
    }
  };

  const packageInfo = getPackageInfo();

  return (
    <div className={`${styles.packageBadge} ${packageInfo.className}`}>
      {packageInfo.label}
    </div>
  );
};

const UserHome = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Quantiq - E-Commerce Çözümleri - Hoş Geldiniz";
    const fetchUserInfo = async () => {
      try {
        const response = await authService.getUserDetails();
        if (response.success && response.user) {
          setUserInfo({
            success: response.success,
            user: {
              ...response.user,
              package: response.user.package as PackageType
            }
          });
        } else {
          setError("Kullanıcı bilgileri alınamadı");
        }
      } catch (err) {
        console.error(err);
        setError("Kullanıcı bilgileri alınamadı");
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  /* const handleVerification = async (type: "email" | "phone") => {
    try {
      const token = localStorage.getItem("auth_token");
      // Development aşamasında direkt true yapıyoruz
      // Gerçek implementasyonda bu kısım API çağrısı yapacak
      setUserInfo((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          user: {
            ...prev.user,
            isEmailVerified:
              type === "email" ? true : prev.user.isEmailVerified,
            isPhoneNumberVerified:
              type === "phone" ? true : prev.user.isPhoneNumberVerified,
          },
        };
      });
    } catch (error) {
      console.error(`Error verifying ${type}:`, error);
      setError(
        `${
          type === "email" ? "E-posta" : "Telefon"
        } doğrulama işlemi başarısız oldu`
      );
    }
  }; */

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error || !userInfo || !userInfo.user) {
    return <div className={styles.error}>{error || "Kullanıcı bilgileri yüklenemedi"}</div>;
  }

  const { user } = userInfo;

  return (
    <div className={styles.userHome}>
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeHeader}>
          <h1>Hoş Geldiniz, {user.name}!</h1>
          <div className={styles.packageBadge}>
            <h2>Paket Bilgileri</h2>
            <PackageInfo packageType={user.package} />
          </div>
        </div>
        <p className={styles.subtitle}>
          Hesap durumunuzu aşağıdan kontrol edebilirsiniz.
        </p>
      </div>

      {user.isProfileRestricted && (
        <div className={styles.restrictionWarning}>
          <span className={styles.warningIcon}>⚠️</span>
          <div className={styles.warningContent}>
            <h3>Hesap Kısıtlaması</h3>
            <p>
              Hesabınızı tam olarak kullanabilmek için lütfen e-posta ve telefon doğrulamalarını tamamlayın.
              Doğrulamalar tamamlanana kadar bazı özellikler kısıtlı olacaktır.
            </p>
          </div>
        </div>
      )}

      <div className={styles.verificationSection}>
        <h2>Hesap Doğrulama Durumu</h2>
        <div className={styles.verificationCards}>
          <div className={styles.verificationCard}>
            <div className={styles.verificationInfo}>
              <div className={styles.verificationHeader}>
                <span className={styles.verificationIcon}>📧</span>
                <h3>E-posta Doğrulama</h3>
              </div>
              <p>{user.email}</p>
              <div className={styles.verificationStatus}>
                <span
                  className={
                    userInfo?.user.isEmailVerified
                      ? styles.verified
                      : styles.unverified
                  }
                >
                  {user.isEmailVerified
                    ? "✓ Doğrulanmış"
                    : "✗ Doğrulanmamış"}
                </span>
              </div>
            </div>
            {!userInfo?.user.isEmailVerified && (
              <button
                className={styles.verifyButton}
                onClick={() => handleVerification("email")}
              >
                E-postayı Doğrula
              </button>
            )}
          </div>

          <div className={styles.verificationCard}>
            <div className={styles.verificationInfo}>
              <div className={styles.verificationHeader}>
                <span className={styles.verificationIcon}>📱</span>
                <h3>Telefon Doğrulama</h3>
              </div>
              <p>{userInfo?.user.phoneNumber}</p>
              <div className={styles.verificationStatus}>
                <span
                  className={
                    userInfo?.user.isPhoneNumberVerified
                      ? styles.verified
                      : styles.unverified
                  }
                >
                  {userInfo?.user.isPhoneNumberVerified
                    ? "✓ Doğrulanmış"
                    : "✗ Doğrulanmamış"}
                </span>
              </div>
            </div>
            {!userInfo?.user.isPhoneNumberVerified && (
              <button
                className={styles.verifyButton}
                onClick={() => handleVerification("phone")}
              >
                Telefonu Doğrula
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
