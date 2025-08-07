import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Heart,
  BookOpen,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Connect = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [smallGroups, setSmallGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('members');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch members
      const { data: membersData } = await supabase
        .from('members')
        .select('*')
        .eq('membership_status', 'active')
        .order('first_name');

      // Fetch small groups
      const { data: groupsData } = await supabase
        .from('small_groups')
        .select(`
          *,
          small_group_members (
            id,
            member_id,
            role,
            members (
              first_name,
              last_name
            )
          )
        `)
        .eq('is_active', true);

      setMembers(membersData || []);
      setSmallGroups(groupsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load community data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.ministry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = smallGroups.filter(group =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getMembershipBadge = (type: string) => {
    const colors = {
      member: 'bg-success text-success-foreground',
      leader: 'bg-primary text-primary-foreground',
      pastor: 'bg-accent text-accent-foreground',
      visitor: 'bg-muted text-muted-foreground',
    };
    return colors[type as keyof typeof colors] || colors.visitor;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">Connect</h1>
        <p className="opacity-90">
          Build meaningful relationships within our church community
        </p>
      </div>

      {/* Search */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search members, groups, or ministries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="groups">Small Groups</TabsTrigger>
          <TabsTrigger value="ministries">Ministries</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          {filteredMembers.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-primary mb-2">No Members Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Member directory is being updated.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.profile_image_url} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {getInitials(member.first_name, member.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary">
                          {member.first_name} {member.last_name}
                        </h3>
                        <Badge className={getMembershipBadge(member.membership_type)}>
                          {member.membership_type}
                        </Badge>
                      </div>
                    </div>

                    {member.ministry && (
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Heart className="h-4 w-4 mr-2" />
                        {member.ministry}
                      </div>
                    )}

                    {member.department && (
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {member.department}
                      </div>
                    )}

                    {member.city && (
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        {member.city}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {member.email && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      )}
                      {member.phone_number && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Small Groups Tab */}
        <TabsContent value="groups" className="space-y-4">
          {filteredGroups.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-primary mb-2">No Small Groups Found</h3>
                <p className="text-muted-foreground">
                  Small groups are being organized. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-primary">{group.name}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {group.meeting_day && group.meeting_time && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {group.meeting_day}s at {group.meeting_time}
                        </div>
                      )}

                      {group.meeting_location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {group.meeting_location}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          {group.small_group_members?.length || 0} members
                          {group.max_members && ` / ${group.max_members} max`}
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" className="flex-1">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Join Group
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Ministries Tab */}
        <TabsContent value="ministries" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Worship Team', description: 'Lead worship through music and song', icon: '🎵', members: 25 },
              { name: 'Youth Ministry', description: 'Serve and mentor young people', icon: '👥', members: 40 },
              { name: 'Children\'s Ministry', description: 'Teach and care for our children', icon: '👶', members: 30 },
              { name: 'Outreach Team', description: 'Share the gospel in the community', icon: '🌟', members: 35 },
              { name: 'Prayer Ministry', description: 'Intercede for the church and community', icon: '🙏', members: 50 },
              { name: 'Hospitality Team', description: 'Welcome and serve our visitors', icon: '🤝', members: 20 },
            ].map((ministry) => (
              <Card key={ministry.name} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-3">{ministry.icon}</div>
                  <h3 className="font-semibold text-primary mb-2">{ministry.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{ministry.description}</p>
                  <div className="flex items-center justify-center text-sm text-muted-foreground mb-3">
                    <Users className="h-4 w-4 mr-1" />
                    {ministry.members} members
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Ministry
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Connect;