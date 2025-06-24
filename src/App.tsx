import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Palette, Accessibility, Wrench, ChevronRight, Moon, Sun, Monitor, ToggleLeft as Toggle, Check, Mail, Smartphone, Volume2, Eye, Lock, Key, Download, Trash2, RefreshCw, X, AlertTriangle } from 'lucide-react';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'select' | 'button' | 'slider';
  value?: any;
  options?: { label: string; value: string }[];
}

interface SettingCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: SettingItem[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'info' | 'warning' | 'danger';
}

function Modal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type }: ModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-red-500" />,
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          iconBg: 'bg-red-100 dark:bg-red-900/30'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/30'
        };
      default:
        return {
          icon: <Download className="w-6 h-6 text-blue-500" />,
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${styles.iconBg}`}>
                {styles.icon}
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmButton}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState('appearance');
  const [settings, setSettings] = useState<Record<string, any>>({
    theme: 'system',
    fontSize: 14,
    reducedMotion: false,
    highContrast: false,
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    twoFactor: false,
    dataSharing: 'minimal',
    profileVisibility: 'public'
  });

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'export' | 'delete' | 'reset' | null;
  }>({ isOpen: false, type: null });

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'system') {
        setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    handleChange(); // Set initial theme
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  // Update theme when setting changes
  useEffect(() => {
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
    } else {
      setCurrentTheme(settings.theme as 'light' | 'dark');
    }
  }, [settings.theme]);

  // Apply theme class to document
  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const openModal = (type: 'export' | 'delete' | 'reset') => {
    setModalState({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  const handleModalConfirm = () => {
    switch (modalState.type) {
      case 'export':
        // Simulate data export
        console.log('Exporting user data...');
        alert('Data export initiated. You will receive an email when ready.');
        break;
      case 'delete':
        // Simulate account deletion
        console.log('Deleting account...');
        alert('Account deletion process started. You will receive a confirmation email.');
        break;
      case 'reset':
        setSettings({
          theme: 'system',
          fontSize: 14,
          reducedMotion: false,
          highContrast: false,
          notifications: true,
          emailNotifications: true,
          pushNotifications: true,
          soundEnabled: true,
          twoFactor: false,
          dataSharing: 'minimal',
          profileVisibility: 'public'
        });
        alert('All settings have been reset to their defaults.');
        break;
    }
    closeModal();
  };

  const getModalConfig = () => {
    switch (modalState.type) {
      case 'export':
        return {
          title: 'Export Your Data',
          message: 'This will create a downloadable file containing all your account data. You will receive an email notification when the export is ready.',
          confirmText: 'Export Data',
          cancelText: 'Cancel',
          type: 'info' as const
        };
      case 'delete':
        return {
          title: 'Delete Account',
          message: 'This action cannot be undone. This will permanently delete your account and remove all your data from our servers.',
          confirmText: 'Delete Account',
          cancelText: 'Cancel',
          type: 'danger' as const
        };
      case 'reset':
        return {
          title: 'Reset All Settings',
          message: 'This will reset all your preferences to their default values. You can always change them again later.',
          confirmText: 'Reset Settings',
          cancelText: 'Cancel',
          type: 'warning' as const
        };
      default:
        return {
          title: '',
          message: '',
          confirmText: '',
          cancelText: '',
          type: 'info' as const
        };
    }
  };

  const categories: SettingCategory[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <Palette className="w-5 h-5" />,
      items: [
        {
          id: 'theme',
          title: 'Theme',
          description: 'Choose your preferred color scheme',
          type: 'select',
          value: settings.theme,
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' }
          ]
        },
        {
          id: 'fontSize',
          title: 'Font Size',
          description: 'Adjust text size for better readability',
          type: 'slider',
          value: settings.fontSize
        },
        {
          id: 'reducedMotion',
          title: 'Reduced Motion',
          description: 'Minimize animations and transitions',
          type: 'toggle',
          value: settings.reducedMotion
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      items: [
        {
          id: 'notifications',
          title: 'Enable Notifications',
          description: 'Receive notifications about activity',
          type: 'toggle',
          value: settings.notifications
        },
        {
          id: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Get updates via email',
          type: 'toggle',
          value: settings.emailNotifications
        },
        {
          id: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Receive push notifications on your devices',
          type: 'toggle',
          value: settings.pushNotifications
        },
        {
          id: 'soundEnabled',
          title: 'Notification Sounds',
          description: 'Play sounds for notifications',
          type: 'toggle',
          value: settings.soundEnabled
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          id: 'twoFactor',
          title: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle',
          value: settings.twoFactor
        },
        {
          id: 'dataSharing',
          title: 'Data Sharing',
          description: 'Control how your data is used',
          type: 'select',
          value: settings.dataSharing,
          options: [
            { label: 'Minimal', value: 'minimal' },
            { label: 'Standard', value: 'standard' },
            { label: 'Full', value: 'full' }
          ]
        },
        {
          id: 'profileVisibility',
          title: 'Profile Visibility',
          description: 'Who can see your profile information',
          type: 'select',
          value: settings.profileVisibility,
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Friends Only', value: 'friends' },
            { label: 'Private', value: 'private' }
          ]
        }
      ]
    },
    {
      id: 'account',
      title: 'Account',
      icon: <User className="w-5 h-5" />,
      items: [
        {
          id: 'exportData',
          title: 'Export Data',
          description: 'Download a copy of your data',
          type: 'button'
        },
        {
          id: 'deleteAccount',
          title: 'Delete Account',
          description: 'Permanently delete your account and data',
          type: 'button'
        }
      ]
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      icon: <Accessibility className="w-5 h-5" />,
      items: [
        {
          id: 'highContrast',
          title: 'High Contrast',
          description: 'Increase contrast for better visibility',
          type: 'toggle',
          value: settings.highContrast
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced',
      icon: <Wrench className="w-5 h-5" />,
      items: [
        {
          id: 'resetSettings',
          title: 'Reset All Settings',
          description: 'Reset all settings to their default values',
          type: 'button'
        }
      ]
    }
  ];

  const currentCategory = categories.find(cat => cat.id === activeCategory);

  const handleButtonClick = (itemId: string) => {
    switch (itemId) {
      case 'exportData':
        openModal('export');
        break;
      case 'deleteAccount':
        openModal('delete');
        break;
      case 'resetSettings':
        openModal('reset');
        break;
    }
  };

  const renderSettingControl = (item: SettingItem) => {
    switch (item.type) {
      case 'toggle':
        return (
          <button
            onClick={() => updateSetting(item.id, !item.value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              item.value 
                ? currentTheme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                : currentTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                item.value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        );
      
      case 'select':
        return (
          <select
            value={item.value}
            onChange={(e) => updateSetting(item.id, e.target.value)}
            className={`block w-40 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              currentTheme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-400'
                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
            }`}
          >
            {item.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'slider':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="12"
              max="20"
              value={item.value}
              onChange={(e) => updateSetting(item.id, parseInt(e.target.value))}
              className="h-2 w-24 rounded-lg cursor-pointer appearance-none slider"
              style={{
                background: currentTheme === 'dark' ? '#4B5563' : '#E5E7EB'
              }}
            />
            <span className={`text-sm w-8 ${
              currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {item.value}px
            </span>
          </div>
        );
      
      case 'button':
        const isDestructive = item.id.includes('delete') || item.id.includes('reset');
        return (
          <button
            onClick={() => handleButtonClick(item.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDestructive
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {item.title}
          </button>
        );
      
      default:
        return null;
    }
  };

    // Dynamic styles based on current theme and settings
  const containerClasses = `min-h-screen transition-colors duration-300 ${
    currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
  }`;

  const cardClasses = `rounded-xl shadow-sm border transition-colors duration-300 ${
    currentTheme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200'
  }`;


  const textPrimary = currentTheme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const textTertiary = currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const modalConfig = getModalConfig();

  return (
    <div className={containerClasses} style={{ fontSize: `${settings.fontSize}px` }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className={`text-3xl font-bold ${textPrimary}`}>Settings</h1>
          </div>
          <p className={textSecondary}>Manage your account preferences and application settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className={`${cardClasses} p-2`}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 text-left rounded-lg transition-all ${
                    activeCategory === category.id
                      ? currentTheme === 'dark'
                        ? 'bg-blue-900/50 text-blue-300 border-r-2 border-blue-500'
                        : 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : currentTheme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {category.icon}
                    <span className="font-medium">{category.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    activeCategory === category.id ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className={cardClasses}>
              {/* Category Header */}
              <div className={`px-6 py-4 border-b transition-colors duration-300 ${
                currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {currentCategory?.icon}
                  <h2 className={`text-xl font-semibold ${textPrimary}`}>
                    {currentCategory?.title}
                  </h2>
                </div>
              </div>

              {/* Settings List */}
              <div className="p-6 space-y-6">
                {currentCategory?.items.map((item) => (
                  <div key={item.id} className={`flex items-center justify-between py-4 border-b transition-colors duration-300 last:border-b-0 ${
                    currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <div className="flex-1 pr-6">
                      <h3 className={`text-sm font-medium mb-1 ${textPrimary}`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm ${textSecondary}`}>
                        {item.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {renderSettingControl(item)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            {activeCategory === 'appearance' && (
              <div className={`mt-6 ${cardClasses} p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Quick Theme Switch</h3>
                <div className="flex space-x-3">
                  {[
                    { key: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
                    { key: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
                    { key: 'system', icon: <Monitor className="w-4 h-4" />, label: 'System' }
                  ].map((theme) => (
                    <button
                      key={theme.key}
                      onClick={() => updateSetting('theme', theme.key)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        settings.theme === theme.key
                          ? currentTheme === 'dark'
                            ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                            : 'border-blue-500 bg-blue-50 text-blue-700'
                          : currentTheme === 'dark'
                            ? 'border-gray-600 hover:border-gray-500 text-gray-300'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {theme.icon}
                      <span className="font-medium">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

       {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleModalConfirm}
        {...modalConfig}
      />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${currentTheme === 'dark' ? '#3B82F6' : '#2563eb'};
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${currentTheme === 'dark' ? '#3B82F6' : '#2563eb'};
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}

export default App;

