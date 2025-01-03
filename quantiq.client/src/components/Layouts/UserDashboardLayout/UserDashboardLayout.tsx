import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserNavBar from '../../UserDashboard/UserNavBar/UserNavBar';
import Notification from '../../Notification/Notification';
import { Menu, X } from 'lucide-react';

interface UserDashboardLayoutProps {
  notification: {
    message: string;
    type: 'success' | 'error';
  } | null;
  onCloseNotification: () => void;
}

const UserDashboardLayout = ({ notification, onCloseNotification }: UserDashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
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

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-bg-secondary p-2 shadow-lg md:hidden hover:bg-bg-primary"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-text-primary" />
        ) : (
          <Menu className="h-6 w-6 text-text-primary" />
        )}
      </button>

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-40 
            transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Overlay for mobile */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          {/* UserNavBar */}
          <div className="relative z-50 h-full">
            <UserNavBar onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="container mx-auto">
            <div className="rounded-xl bg-bg-secondary p-6 shadow-lg">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;