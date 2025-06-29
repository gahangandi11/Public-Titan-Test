import { useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { watchUser, logout } from "../../services/contexts/AuthContext/AuthContext";

const useInactivityTimer = (timeout: number) => {
    const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
    const history = useHistory();
  
    const handleInactivityLogout = useCallback(async () => {
      console.log(`User has been inactive. Logging out.`);
      try {
        await logout();
        history.push('/login');
      } catch (error) {
        console.error("Error during inactivity logout:", error);
        history.push('/login');
      }
    }, [history]);
  
    const resetTimer = useCallback(() => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      inactivityTimer.current = setTimeout(handleInactivityLogout, timeout);
    }, [handleInactivityLogout, timeout]);
  
    useEffect(() => {
      const activityEvents: (keyof WindowEventMap)[] = [
        'mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'
      ];
  
      const setupInactivityWatch = () => {
        activityEvents.forEach(event => window.addEventListener(event, resetTimer));
        resetTimer();
      };
      
      const cleanupInactivityWatch = () => {
        activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
        if (inactivityTimer.current) {
          clearTimeout(inactivityTimer.current);
        }
      };
      
      const unsubscribe = watchUser().onAuthStateChanged((user) => {
        cleanupInactivityWatch();
        if (user) {
          setupInactivityWatch();
        }
      });
  
      return () => {
        unsubscribe();
        cleanupInactivityWatch();
      };
    }, [resetTimer]);
  };

  export default useInactivityTimer; 