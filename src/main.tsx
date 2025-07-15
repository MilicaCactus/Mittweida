import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase.ts';
import { AuthProvider } from './components/hooks/LoginProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SessionContextProvider supabaseClient={supabase}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </SessionContextProvider>
    </React.StrictMode>
);