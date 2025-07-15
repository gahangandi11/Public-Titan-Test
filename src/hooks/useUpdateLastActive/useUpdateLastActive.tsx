import { useEffect, useRef, useCallback } from 'react';
import { updateUserLastInActive } from '../../services/firestoreService'; 
import { getCurrentUser } from '../../services/contexts/AuthContext/AuthContext'; 


const useUpdateLastInActive = (inactivityMs: number) => {
  const currentUser  = getCurrentUser();
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // This is the function that will be called after the user is idle.
  const updateTimestamp = useCallback(async () => {
    if (currentUser) {
      try {
        await updateUserLastInActive(currentUser.uid);
      } catch (error) {
        console.error("Debounce: Failed to update last active timestamp.", error);
      }
    }
  }, [currentUser]);


  // This handler resets the inactivity timer every time user activity is detected.
  const handleActivity = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(updateTimestamp, inactivityMs);
  }, [updateTimestamp, inactivityMs]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const activityEvents: (keyof WindowEventMap)[] = [
      'mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'
    ];

    activityEvents.forEach(event => window.addEventListener(event, handleActivity));

    handleActivity();

    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      activityEvents.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [currentUser, handleActivity]);
};

export default useUpdateLastInActive;



