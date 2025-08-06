import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Church, Bell, Mail, Shield, Users, Database, Save, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChurchSettings {
  id?: string;
  church_name: string;
  church_address: string;
  church_phone: string;
  church_email: string;
  church_website: string;
  service_times: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  event_reminders: boolean;
  donation_alerts: boolean;
}

const AdminSettings = () => {
  const [churchSettings, setChurchSettings] = useState<ChurchSettings>({
    church_name: '',
    church_address: '',
    church_phone: '',
    church_email: '',
    church_website: '',
    service_times: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_notifications: true,
    sms_notifications: false,
    event_reminders: true,
    donation_alerts: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch church settings
      const { data: churchData, error: churchError } = await supabase
        .from('church_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (churchError && churchError.code !== 'PGRST116') {
        throw churchError;
      }

      if (churchData) {
        setChurchSettings(churchData);
      }

      // Fetch notification preferences for current user
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data: notifData, error: notifError } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', userData.user.id)
          .maybeSingle();

        if (notifError && notifError.code !== 'PGRST116') {
          throw notifError;
        }

        if (notifData) {
          setNotificationSettings({
            email_notifications: notifData.email_notifications,
            sms_notifications: notifData.sms_notifications,
            event_reminders: notifData.event_reminders,
            donation_alerts: notifData.donation_alerts
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveChurchSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('church_settings')
        .upsert([churchSettings], { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Church settings saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save church settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      setSaving(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notification_preferences')
        .upsert([{
          user_id: userData.user.id,
          ...notificationSettings
        }], { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification settings saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const exportData = async (dataType: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${dataType} data...`
    });
    // Implementation for data export would go here
  };

  const importData = async (dataType: string) => {
    toast({
      title: "Import Ready",
      description: `Ready to import ${dataType} data. Please select a file.`
    });
    // Implementation for data import would go here
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your church settings and system configuration
          </p>
        </div>
        <Badge variant="outline" className="flex items-center">
          <Settings className="h-3 w-3 mr-1" />
          Admin Access
        </Badge>
      </div>

      <Tabs defaultValue="church" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="church">Church Info</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="church" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Church className="h-5 w-5 mr-2" />
                Church Information
              </CardTitle>
              <CardDescription>
                Update your church's basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="church_name">Church Name</Label>
                  <Input
                    id="church_name"
                    value={churchSettings.church_name}
                    onChange={(e) => setChurchSettings({ ...churchSettings, church_name: e.target.value })}
                    placeholder="Enter church name"
                  />
                </div>
                <div>
                  <Label htmlFor="church_phone">Phone Number</Label>
                  <Input
                    id="church_phone"
                    value={churchSettings.church_phone}
                    onChange={(e) => setChurchSettings({ ...churchSettings, church_phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="church_email">Email Address</Label>
                  <Input
                    id="church_email"
                    type="email"
                    value={churchSettings.church_email}
                    onChange={(e) => setChurchSettings({ ...churchSettings, church_email: e.target.value })}
                    placeholder="info@yourchurch.org"
                  />
                </div>
                <div>
                  <Label htmlFor="church_website">Website</Label>
                  <Input
                    id="church_website"
                    value={churchSettings.church_website}
                    onChange={(e) => setChurchSettings({ ...churchSettings, church_website: e.target.value })}
                    placeholder="https://yourchurch.org"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="church_address">Address</Label>
                <Textarea
                  id="church_address"
                  value={churchSettings.church_address}
                  onChange={(e) => setChurchSettings({ ...churchSettings, church_address: e.target.value })}
                  placeholder="Enter church address"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="service_times">Service Times</Label>
                <Textarea
                  id="service_times"
                  value={churchSettings.service_times}
                  onChange={(e) => setChurchSettings({ ...churchSettings, service_times: e.target.value })}
                  placeholder="Sunday: 9:00 AM & 11:00 AM&#10;Wednesday: 7:00 PM"
                  rows={3}
                />
              </div>

              <Button onClick={saveChurchSettings} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Church Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications about church activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.email_notifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, email_notifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via text message
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.sms_notifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, sms_notifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Event Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders about upcoming events
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.event_reminders}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, event_reminders: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Donation Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about donation activities
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.donation_alerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, donation_alerts: checked })
                  }
                />
              </div>

              <Button onClick={saveNotificationSettings} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system-wide settings and security options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Security Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Require email verification for new members</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Enable two-factor authentication</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Auto-logout after inactivity</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">System Maintenance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Automatic database backups</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">System update notifications</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Performance monitoring</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
              <CardDescription>
                Import, export, and manage your church data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Export Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => exportData('members')}>
                    <Users className="h-4 w-4 mr-2" />
                    Export Members
                  </Button>
                  <Button variant="outline" onClick={() => exportData('donations')}>
                    <Database className="h-4 w-4 mr-2" />
                    Export Donations
                  </Button>
                  <Button variant="outline" onClick={() => exportData('events')}>
                    <Database className="h-4 w-4 mr-2" />
                    Export Events
                  </Button>
                  <Button variant="outline" onClick={() => exportData('attendance')}>
                    <Database className="h-4 w-4 mr-2" />
                    Export Attendance
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-4">Import Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => importData('members')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Members
                  </Button>
                  <Button variant="outline" onClick={() => importData('donations')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Donations
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: CSV, Excel (.xlsx)
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Danger Zone</h4>
                <div className="space-y-2">
                  <Button variant="destructive" size="sm">
                    Reset All Data
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone. This will permanently delete all church data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;