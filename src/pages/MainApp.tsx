import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Events from '@/components/Events';
import SplashScreen from '@/components/SplashScreen';
import Auth from '@/pages/Auth';

const MainApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'events':
        return <Events />;
      case 'sermons':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-primary mb-4">Sermons Library</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 'prayer':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-primary mb-4">Prayer Requests</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 'giving':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-primary mb-4">Give & Tithe</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 'connect':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-primary mb-4">Connect</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-primary mb-4">Settings</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      default:
        return <Dashboard user={user} />;
    }
  };

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    return <Auth />;
  }

  // Main app with navigation
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={user} 
      />
      
      {/* Main Content */}
      <div className="md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 px-4 md:px-8 py-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainApp;