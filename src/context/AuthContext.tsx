import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Notification } from '../types.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  notifications: Notification[];
  unreadCount: number;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  demoLogin: (role: 'citizen' | 'officer' | 'admin') => Promise<void>;
  logout: () => void;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('ecowatch_token'));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            // Auto login as default demo citizen if token invalid
            await demoLogin('citizen');
          }
        } catch {
          await demoLogin('citizen');
        }
      } else {
        // Default to demo citizen on first visit so all pages are immediately accessible
        await demoLogin('citizen');
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  useEffect(() => {
    if (user) {
      refreshNotifications();
      const interval = setInterval(refreshNotifications, 20000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const refreshNotifications = async () => {
    if (!token) return;
    try {
      const res = await api.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.warn('Failed to load notifications', e);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      showToast('All notifications marked as read', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login(email, pass);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('ecowatch_token', res.data.token);
        showToast(`Welcome back, ${res.data.user.name}`, 'success');
        return true;
      }
      showToast(res.message || 'Login failed', 'error');
      return false;
    } catch (err: any) {
      showToast(err.message || 'Error logging in', 'error');
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await api.register(data);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('ecowatch_token', res.data.token);
        showToast('Registration successful! Welcome to EcoWatch.', 'success');
        return true;
      }
      showToast(res.message || 'Registration failed', 'error');
      return false;
    } catch (err: any) {
      showToast(err.message || 'Error registering', 'error');
      return false;
    }
  };

  const demoLogin = async (role: 'citizen' | 'officer' | 'admin') => {
    try {
      const res = await api.demoLogin(role);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('ecowatch_token', res.data.token);
        showToast(`Switched view to: ${role.toUpperCase()} (${res.data.user.name})`, 'info');
      }
    } catch (err) {
      console.error('Demo login error', err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ecowatch_token');
    showToast('Signed out successfully', 'info');
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        notifications,
        unreadCount,
        login,
        register,
        demoLogin,
        logout,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        toastMessage,
        toastType,
        showToast,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-sm font-medium border text-white ${
              toastType === 'success'
                ? 'bg-emerald-700 border-emerald-500'
                : toastType === 'error'
                ? 'bg-rose-700 border-rose-500'
                : 'bg-slate-900 border-slate-700'
            }`}
          >
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
