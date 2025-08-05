import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminStats {
  totalMembers: number;
  totalEvents: number;
  totalDonations: number;
  totalVisitors: number;
  monthlyDonations: number;
  recentMembers: any[];
  recentDonations: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalMembers: 0,
    totalEvents: 0,
    totalDonations: 0,
    totalVisitors: 0,
    monthlyDonations: 0,
    recentMembers: [],
    recentDonations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch all stats in parallel
      const [
        membersResponse,
        eventsResponse,
        donationsResponse,
        visitorsResponse,
        recentMembersResponse,
        recentDonationsResponse,
        monthlyDonationsResponse
      ] = await Promise.all([
        supabase.from('members').select('id'),
        supabase.from('events').select('id'),
        supabase.from('donations').select('id'),
        supabase.from('visitors').select('id'),
        supabase.from('members').select('first_name, last_name, created_at, membership_type').order('created_at', { ascending: false }).limit(5),
        supabase.from('donations').select('amount, donor_name, created_at, donation_type').order('created_at', { ascending: false }).limit(5),
        supabase.from('donations').select('amount').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      const monthlyTotal = monthlyDonationsResponse.data?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0;

      setStats({
        totalMembers: membersResponse.data?.length || 0,
        totalEvents: eventsResponse.data?.length || 0,
        totalDonations: donationsResponse.data?.length || 0,
        totalVisitors: visitorsResponse.data?.length || 0,
        monthlyDonations: monthlyTotal,
        recentMembers: recentMembersResponse.data || [],
        recentDonations: recentDonationsResponse.data || []
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      description: "Active church members",
      icon: Users,
      trend: "+12% from last month"
    },
    {
      title: "Total Events",
      value: stats.totalEvents,
      description: "Scheduled events",
      icon: Calendar,
      trend: "+3 new this month"
    },
    {
      title: "Monthly Donations",
      value: `$${stats.monthlyDonations.toLocaleString()}`,
      description: "This month's giving",
      icon: DollarSign,
      trend: "+8% from last month"
    },
    {
      title: "Total Visitors",
      value: stats.totalVisitors,
      description: "Church visitors",
      icon: UserPlus,
      trend: "+5 this week"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <Badge variant="secondary" className="px-3 py-1">
          Administrator
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{member.first_name} {member.last_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {member.membership_type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentDonations.map((donation, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{donation.donor_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${Number(donation.amount).toLocaleString()}</p>
                    <Badge variant="outline" className="text-xs">
                      {donation.donation_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;