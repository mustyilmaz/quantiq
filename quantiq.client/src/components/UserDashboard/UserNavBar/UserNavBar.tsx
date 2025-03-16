import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { Home, Settings, Key, FileText, LogOut, Sun, Moon, BookKey, BetweenHorizonalStart } from "lucide-react";

interface UserNavbarProps {
  onCloseMobileMenu: () => void;
}

const UserNavbar = ({ onCloseMobileMenu }: UserNavbarProps) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useContext(AuthContext);

  const navItems = [
    { path: "/", icon: <Home size={24} />, text: "Landing Page" },
    { path: "/user/dashboard", icon: <Home size={24} />, text: "Ana Sayfanız" },
    {
      path: "/user/account-settings",
      icon: <Settings size={24} />,
      text: "Hesap Ayarları",
    },
    {
      path: "/user/change-password",
      icon: <Key size={24} />,
      text: "Şifre Değiştir",
    },
    {
      path: "/user/api-information",
      icon: <BookKey size={24} />,
      text: "API Bilgileri",
    },
    {
      path: "/trendyol/trendyol-categories",
      icon: <BetweenHorizonalStart size={24} />,
      text: "Trendyol Kategorileri",
    },
  ];

  const handleNavigation = () => {
    onCloseMobileMenu();
  };

  return (
    <nav
      className={`
        h-screen bg-bg-secondary border-r border-border-color 
        transition-all duration-300 ease-in-out
        md:h-auto md:fixed md:left-0 md:top-1/2 md:-translate-y-1/2
        md:rounded-r-lg md:shadow-lg
        ${isExpanded ? "w-64" : "w-20"}
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ul className="py-4 space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={handleNavigation}
              className={`
                flex items-center px-4 py-3 
                hover:bg-bg-primary hover:text-accent-color 
                transition-colors duration-200
                ${
                  location.pathname === item.path
                    ? "bg-bg-primary text-accent-color border-l-4 border-accent-color"
                    : "text-text-secondary border-l-4 border-transparent"
                }
              `}
            >
              <span className="min-w-[24px]">{item.icon}</span>
              <span
                className={`
                  ml-3 whitespace-nowrap
                  transition-all duration-200
                  ${
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }
                  md:${isExpanded ? "opacity-100" : "opacity-0"}
                `}
              >
                {item.text}
              </span>
            </Link>
          </li>
        ))}

        <li className="border-t border-border-color mt-4 pt-4">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 p-3 hover:bg-base-300 rounded-lg transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === "dark" ? "Açık Mod" : "Koyu Mod"}</span>
          </button>
          <button
            onClick={() => {
              logout();
              handleNavigation();
            }}
            className={`
              w-full flex items-center px-4 py-3
              text-text-secondary hover:bg-bg-primary hover:text-red-500 
              transition-colors duration-200
            `}
          >
            <span className="min-w-[24px]">
              <LogOut size={24} />
            </span>
            <span
              className={`
                ml-3 whitespace-nowrap
                transition-all duration-200
                ${
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }
              `}
            >
              Çıkış Yap
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default UserNavbar;
