import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
// import { useTheme } from "../../context/ThemeContext";
import { Menu, X} from "lucide-react";
import logo from "../../../assets/logo.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const auth = useAuth();
  // const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (auth.isLoading) {
    return (
      <nav className={`fixed top-10 w-full z-30 h-20 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur shadow-lg h-[70px]' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between  px-4 sm:px-6 md:px-8">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Quantiq Logo" className="h-10 w-auto" />
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-10 w-full z-30 h-20 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur shadow-lg h-[70px]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between  px-4 sm:px-6 md:px-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Quantiq Logo" className="h-10 w-auto" />
        </Link>

        <button
          className="md:hidden text-gray-900 bg-white hover:bg-slate-200 cursor-pointer rounded-full w-12 h-12 flex items-center justify-center p-0"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div
          className={`
          md:flex items-center gap-8
          fixed md:static  left-0 right-0
          bg-white md:bg-transparent p-8 md:p-0
          flex-col md:flex-row md:items-stretch
          transform ${isScrolled ? "top-[68px] " : "top-[120px]"} ${
            isMenuOpen
              ? "translate-y-0 opacity-100 visible"
              : "-translate-y-full opacity-0 invisible md:translate-y-0 md:opacity-100 md:visible"
          }
          transition-all duration-300
          border-t border-border md:border-none
        `}
        >
          <ul className="flex flex-col md:flex-row gap-4 md:gap-8 list-none m-0 p-0 items-center">
            <li>
              <a
                href="/"
                className="text-gray-900 font-medium text-[0.95rem] transition-colors duration-300 py-2 relative hover:text-primary group"
              >
                Ana Sayfa
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="text-gray-900 font-medium text-[0.95rem] transition-colors duration-300 py-2 relative hover:text-primary group"
              >
                Fiyatlandırma
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
            <li>
              <Link
                to="/contact"
                className={`text-gray-900 font-medium text-[0.95rem] transition-colors duration-300 py-2 relative hover:text-primary group ${
                  location.pathname === "/contact" ? "text-primary" : ""
                }`}
                onClick={closeMenu}
              >
                İletişim
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    location.pathname === "/contact"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          </ul>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* <button
              className="p-2 text-gray-900 bg-slate-200 hover:bg-primary/50 rounded-full transition-colors duration-300"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button> */}

            {auth.isAuthenticated && auth.user ? (
              <div>
                <Link
                  to="/user/dashboard"
                  className="text-gray-900 font-medium hover:text-primary transition-colors duration-300"
                >
                  {auth.user.name}
                </Link>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <Link
                  to="/user/login"
                  className="px-6 py-2 text-gray-900 font-medium transition-colors duration-300 hover:text-primary rounded-full text-center"
                  onClick={closeMenu}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-primary hover:bg-secondary hover:text-white text-white font-medium rounded-full transition-colors duration-300 text-center"
                  onClick={closeMenu}
                >
                  Ücretsiz Başla
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;