import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, Plus, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  membership_type: string;
  membership_status: string;
  created_at: string;
  profile_image_url: string;
}

const AdminMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, statusFilter]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(member =>
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone_number?.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.membership_status === statusFilter);
    }

    setFilteredMembers(filtered);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'pastor': return 'bg-purple-500';
      case 'elder': return 'bg-blue-500';
      case 'member': return 'bg-green-500';
      case 'visitor': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
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
        <h1 className="text-3xl font-bold text-primary">Member Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">
                  {members.filter(m => m.membership_status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">
                  {members.filter(m => m.membership_type === 'visitor').length}
                </p>
                <p className="text-sm text-muted-foreground">Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">
                  {members.filter(m => m.membership_type === 'member').length}
                </p>
                <p className="text-sm text-muted-foreground">Full Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover-scale cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.profile_image_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(member.first_name, member.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {member.first_name} {member.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {member.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.phone_number}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Badge variant="outline" className={getMembershipColor(member.membership_type)}>
                  {member.membership_type}
                </Badge>
                <Badge 
                  variant={member.membership_status === 'active' ? 'default' : 'secondary'}
                >
                  {member.membership_status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Joined: {new Date(member.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No members found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminMembers;