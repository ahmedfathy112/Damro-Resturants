'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; 

// import { createClient } from '@supabase/supabase-js';
const RealtimeContext = createContext();

export const RealtimeProvider = ({ children }) => {

  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    
    const channel = supabase
      .channel('db-global-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' }, 
        (payload) => {
          console.log('تغيير جديد في الداتابيز:', payload);
          setLastUpdate(payload); 
        }
      )
      .subscribe();

    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ lastUpdate }}>
      {children}
    </RealtimeContext.Provider>
  );
};

// Hook لاستخدام الداتا في أي مكان
export const useGlobalRealtime = () => useContext(RealtimeContext);