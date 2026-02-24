import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, UserIcon, LogInIcon } from 'lucide-react';

interface NavbarProps {
  isAuthenticated?: boolean;
}

export default function Navbar({ isAuthenticated = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">Orderly</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && !isLandingPage && (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link to="/customers" className="text-gray-600 hover:text-gray-900 transition-colors">
                Customers
              </Link>
              <Link to="/orders" className="text-gray-600 hover:text-gray-900 transition-colors">
                Orders
              </Link>
              <Link to="/reminders" className="text-gray-600 hover:text-gray-900 transition-colors">
                Reminders
              </Link>
              <Link to="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">
                Analytics
              </Link>
            </div>
          )}

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLandingPage ? (
              <>
                <button className="btn-secondary">
                  <LogInIcon className="w-4 h-4 mr-2" />
                  Login
                </button>
                <button className="btn-primary">Get Started</button>
              </>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/settings" className="text-gray-600 hover:text-gray-900">
                  <UserIcon className="w-5 h-5" />
                </Link>
                <button className="btn-secondary">Logout</button>
              </div>
            ) : (
              <button className="btn-primary">
                <LogInIcon className="w-4 h-4 mr-2" />
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {isAuthenticated && !isLandingPage && (
              <div className="flex flex-col space-y-3 mb-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 py-2">
                  Dashboard
                </Link>
                <Link to="/customers" className="text-gray-600 hover:text-gray-900 py-2">
                  Customers
                </Link>
                <Link to="/orders" className="text-gray-600 hover:text-gray-900 py-2">
                  Orders
                </Link>
                <Link to="/reminders" className="text-gray-600 hover:text-gray-900 py-2">
                  Reminders
                </Link>
                <Link to="/analytics" className="text-gray-600 hover:text-gray-900 py-2">
                  Analytics
                </Link>
              </div>
            )}
            
            <div className="flex flex-col space-y-3">
              {isLandingPage ? (
                <>
                  <button className="btn-secondary justify-center">
                    <LogInIcon className="w-4 h-4 mr-2" />
                    Login
                  </button>
                  <button className="btn-primary justify-center">Get Started</button>
                </>
              ) : isAuthenticated ? (
                <>
                  <Link to="/settings" className="btn-secondary justify-center">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <button className="btn-secondary justify-center">Logout</button>
                </>
              ) : (
                <button className="btn-primary justify-center">
                  <LogInIcon className="w-4 h-4 mr-2" />
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
