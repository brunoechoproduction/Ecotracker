import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

interface NotificationContextData {
  hasUnread: boolean;
  setHasUnread: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Listen for incoming notifications while the app is foregrounded
    const subscription = Notifications.addNotificationReceivedListener(() => {
      setHasUnread(true);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ hasUnread, setHasUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
