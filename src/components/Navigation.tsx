import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Music, 
  Heart, 
  Users, 
  Settings, 
  LogOut,
  Church,
  Gift,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: any;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, user }) => {
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Goodbye!",
        description: "You have been logged out successfully.",
        variant: "default",
      });
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'sermons', label: 'Sermons', icon: Music },
    { id: 'prayer', label: 'Prayer', icon: Heart },
    { id: 'giving', label: 'Giving', icon: Gift },
    { id: 'connect', label: 'Connect', icon: Users },
  ];

  // Admin navigation items
  const adminItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: BarChart3 },
    { id: 'admin-members', label: 'Members', icon: Users },
    { id: 'admin-events', label: 'Events', icon: Calendar },
    { id: 'admin-financials', label: 'Financials', icon: Gift },
  ];

  // Check if user is admin
  const isAdmin = user?.user_metadata?.role === 'admin' || 
                  user?.app_metadata?.role === 'admin';

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t shadow-large z-40">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                className="flex-col h-12 px-1"
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Desktop Side Navigation */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:left-0 md:top-0 md:h-full bg-card border-r shadow-soft z-30">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Church className="h-8 w-8 text-primary" />
            <div>
              <h2 className="font-bold text-primary">Greater Works</h2>
              <p className="text-sm text-muted-foreground">City Church</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              {user?.user_metadata?.first_name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.user_metadata?.first_name && user?.user_metadata?.last_name 
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                  : user?.email || 'User'
                }
              </p>
              <p className="text-xs text-muted-foreground">Church Member</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <hr className="my-4" />
              <div className="mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                  Administration
                </p>
              </div>
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => onViewChange(item.id)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </>
          )}
          
          <hr className="my-4" />
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onViewChange('settings')}
          >
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </Button>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b shadow-soft z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Church className="h-6 w-6 text-primary" />
            <h1 className="font-bold text-primary">Greater Works</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {user?.user_metadata?.first_name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewChange('settings')}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;