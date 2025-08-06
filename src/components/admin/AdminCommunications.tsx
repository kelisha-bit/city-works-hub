import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Send, MessageSquare, Users, Calendar, Mail, Phone, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Communication {
  id: string;
  subject: string;
  message: string;
  recipient_type: string;
  recipient_ids: string[] | null;
  communication_type: string;
  status: string;
  sent_at: string | null;
  scheduled_at: string | null;
  created_at: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  channel: string;
  created_at: string;
}

const AdminCommunications = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    message: '',
    recipient_type: 'all',
    recipient_ids: [] as string[],
    communication_type: 'email',
    scheduled_at: ''
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    body: '',
    channel: 'email'
  });
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [commsResponse, templatesResponse, membersResponse] = await Promise.all([
        supabase.from('communications').select('*').order('created_at', { ascending: false }),
        supabase.from('message_templates').select('*').order('created_at', { ascending: false }),
        supabase.from('members').select('id, first_name, last_name, email, membership_type')
      ]);

      if (commsResponse.data) setCommunications(commsResponse.data);
      if (templatesResponse.data) setTemplates(templatesResponse.data);
      if (membersResponse.data) setMembers(membersResponse.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch communications data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      const { data, error } = await supabase.from('communications').insert([{
        ...newMessage,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
        status: newMessage.scheduled_at ? 'scheduled' : 'sent',
        sent_at: newMessage.scheduled_at ? null : new Date().toISOString()
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: newMessage.scheduled_at ? "Message scheduled successfully" : "Message sent successfully"
      });

      setNewMessage({
        subject: '',
        message: '',
        recipient_type: 'all',
        recipient_ids: [],
        communication_type: 'email',
        scheduled_at: ''
      });
      setIsMessageDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const createTemplate = async () => {
    try {
      const { error } = await supabase.from('message_templates').insert([newTemplate]);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Template created successfully"
      });

      setNewTemplate({
        name: '',
        subject: '',
        body: '',
        channel: 'email'
      });
      setIsTemplateDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'scheduled': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  const getCommunicationStats = () => {
    const total = communications.length;
    const sent = communications.filter(c => c.status === 'sent').length;
    const scheduled = communications.filter(c => c.status === 'scheduled').length;
    const drafts = communications.filter(c => c.status === 'draft').length;

    return { total, sent, scheduled, drafts };
  };

  const stats = getCommunicationStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <div className="space-x-2">
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Send New Message</DialogTitle>
                  <DialogDescription>
                    Send a message to members via email or SMS
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipient_type">Recipient Type</Label>
                      <Select
                        value={newMessage.recipient_type}
                        onValueChange={(value) => setNewMessage({ ...newMessage, recipient_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Members</SelectItem>
                          <SelectItem value="members">Full Members Only</SelectItem>
                          <SelectItem value="visitors">Visitors Only</SelectItem>
                          <SelectItem value="specific">Specific Members</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="communication_type">Type</Label>
                      <Select
                        value={newMessage.communication_type}
                        onValueChange={(value) => setNewMessage({ ...newMessage, communication_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                      placeholder="Message subject"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      value={newMessage.message}
                      onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                      placeholder="Type your message here..."
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="scheduled_at">Schedule (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={newMessage.scheduled_at}
                      onChange={(e) => setNewMessage({ ...newMessage, scheduled_at: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={sendMessage}>
                      {newMessage.scheduled_at ? 'Schedule Message' : 'Send Message'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Message Template</DialogTitle>
                  <DialogDescription>
                    Create a reusable message template
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Template Name</Label>
                      <Input
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        placeholder="Template name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="channel">Channel</Label>
                      <Select
                        value={newTemplate.channel}
                        onValueChange={(value) => setNewTemplate({ ...newTemplate, channel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      value={newTemplate.subject}
                      onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                      placeholder="Template subject"
                    />
                  </div>

                  <div>
                    <Label htmlFor="body">Body</Label>
                    <Textarea
                      value={newTemplate.body}
                      onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                      placeholder="Template body"
                      rows={6}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createTemplate}>
                      Create Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>
                View and manage all communications sent to your congregation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communications.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No messages yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Start communicating with your congregation by sending your first message
                    </p>
                  </div>
                ) : (
                  communications.map((comm) => (
                    <div key={comm.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{comm.subject}</h4>
                          <Badge variant={getStatusBadgeVariant(comm.status)}>
                            {comm.status}
                          </Badge>
                          <Badge variant="outline">
                            {comm.communication_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {comm.message.length > 100 ? `${comm.message.substring(0, 100)}...` : comm.message}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>To: {comm.recipient_type}</span>
                          <span>
                            {comm.sent_at 
                              ? `Sent: ${new Date(comm.sent_at).toLocaleDateString()}`
                              : comm.scheduled_at
                              ? `Scheduled: ${new Date(comm.scheduled_at).toLocaleDateString()}`
                              : `Created: ${new Date(comm.created_at).toLocaleDateString()}`
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>
                Manage reusable message templates for common communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templates.length === 0 ? (
                  <div className="text-center py-8">
                    <Edit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No templates yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Create templates for frequently used messages
                    </p>
                  </div>
                ) : (
                  templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline">{template.channel}</Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{template.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {template.body.length > 100 ? `${template.body.substring(0, 100)}...` : template.body}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCommunications;