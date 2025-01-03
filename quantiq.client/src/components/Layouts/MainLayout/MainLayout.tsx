import { Outlet } from 'react-router-dom';
import Navbar from '../../LandingPage/NavBar/NavBar';
import Footer from '../../Footer/Footer';
import NewsStrip from '../../LandingPage/NewsStrip/NewsStrip';
import Notification from '../../Notification/Notification';

interface MainLayoutProps {
  notification: {
    message: string;
    type: 'success' | 'error';
  } | null;
  onCloseNotification: () => void;
}

const MainLayout = ({ notification, onCloseNotification }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      {/* News Strip */}
      <NewsStrip />

      {/* Header Container */}
      <header className="sticky top-0 z-50 border-b border-border-color bg-bg-primary/80 backdrop-blur-sm">
        <div className="w-full">
          <Navbar />
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={onCloseNotification}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border-color bg-bg-secondary">
        <div className="container mx-auto">
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;