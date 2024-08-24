import React, { ReactNode, useEffect } from 'react';
import Header from './header/Header';
import Footer from './Footer';
import NotificationComponent from '../components/notificationComponent/NotificationComponent';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import { RootState } from '../store';
import { ToastContainer } from 'react-bootstrap';
import { resetNotifications } from '../store/features/notifications/notificationsSlice';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const notifications = useAppSelector((state: RootState) => state.notifications.notifications);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetNotifications());
  }, []);
  
  return (
    <div className="App">
      <Header />
      <main>
        {
          (notifications && notifications.length > 0) &&
          <ToastContainer
            className="p-3"
            position='top-end'
            style={{ zIndex: 1 }}
          >
            {
              notifications.map((notification, index) => 
                <NotificationComponent 
                  variant={notification.variant}
                  text={notification.text}
                  delay={notification.delay}
                  key={`notification-${index}`}
                  />
              )
            }
          </ToastContainer>
        }
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;