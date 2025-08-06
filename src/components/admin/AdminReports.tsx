import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp, Users, DollarSign, Calendar, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';

interface ReportData {
  membershipStats: any[];
  donationTrends: any[];
  attendanceData: any[];
  financialSummary: any;
  eventStats: any[];
}

const AdminReports = () => {
  const [reportData, setReportData] = useState<ReportData>({
    membershipStats: [],
    donationTrends: [],
    attendanceData: [],
    financialSummary: {},
    eventStats: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportType, setReportType] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Get date filters
      const startDate = dateRange?.from ? dateRange.from.toISOString() : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = dateRange?.to ? dateRange.to.toISOString() : new Date().toISOString();

      const [
        membersResponse,
        donationsResponse,
        attendanceResponse,
        eventsResponse,
        visitorsResponse
      ] = await Promise.all([
        supabase.from('members').select('*'),
        supabase.from('donations').select('*').gte('donation_date', startDate.split('T')[0]).lte('donation_date', endDate.split('T')[0]),
        supabase.from('event_attendance_counts').select('*').gte('attendance_date', startDate.split('T')[0]).lte('attendance_date', endDate.split('T')[0]),
        supabase.from('events').select('*'),
        supabase.from('visitors').select('*').gte('visit_date', startDate.split('T')[0]).lte('visit_date', endDate.split('T')[0])
      ]);

      // Process membership stats
      const membershipStats = processMembershipStats(membersResponse.data || []);
      
      // Process donation trends
      const donationTrends = processDonationTrends(donationsResponse.data || []);
      
      // Process attendance data
      const attendanceData = processAttendanceData(attendanceResponse.data || []);
      
      // Process financial summary
      const financialSummary = processFinancialSummary(donationsResponse.data || []);
      
      // Process event stats
      const eventStats = processEventStats(eventsResponse.data || []);

      setReportData({
        membershipStats,
        donationTrends,
        attendanceData,
        financialSummary,
        eventStats
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch report data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processMembershipStats = (members: any[]) => {
    const stats = members.reduce((acc, member) => {
      const type = member.membership_type || 'visitor';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(stats).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percentage: Math.round((count as number / members.length) * 100)
    }));
  };

  const processDonationTrends = (donations: any[]) => {
    const monthlyData = donations.reduce((acc, donation) => {
      const month = new Date(donation.donation_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + parseFloat(donation.amount);
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount: parseFloat(amount as string).toFixed(2)
    }));
  };

  const processAttendanceData = (attendance: any[]) => {
    return attendance.map(record => ({
      date: new Date(record.attendance_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: record.total_count || 0,
      members: record.members_count || 0,
      visitors: record.visitors_count || 0
    }));
  };

  const processFinancialSummary = (donations: any[]) => {
    const total = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const average = donations.length > 0 ? total / donations.length : 0;
    const byType = donations.reduce((acc, d) => {
      const type = d.donation_type || 'other';
      acc[type] = (acc[type] || 0) + parseFloat(d.amount);
      return acc;
    }, {});

    return {
      total,
      average,
      count: donations.length,
      byType: Object.entries(byType).map(([type, amount]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        amount: parseFloat(amount as string),
        percentage: Math.round((parseFloat(amount as string) / total) * 100)
      }))
    };
  };

  const processEventStats = (events: any[]) => {
    const stats = events.reduce((acc, event) => {
      const type = event.event_type || 'other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(stats).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count
    }));
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`
    });
    // Implementation for export would go here
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', '#8884d8', '#82ca9d', '#ffc658'];

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
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your church activities and growth
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="membership">Membership</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{reportData.membershipStats.reduce((sum, stat) => sum + stat.count, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold">${reportData.financialSummary.total?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Events Held</p>
                <p className="text-2xl font-bold">{reportData.eventStats.reduce((sum, stat) => sum + stat.count, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg. Attendance</p>
                <p className="text-2xl font-bold">
                  {reportData.attendanceData.length > 0 
                    ? Math.round(reportData.attendanceData.reduce((sum, record) => sum + record.total, 0) / reportData.attendanceData.length)
                    : 0
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Donations</CardTitle>
                <CardDescription>Donation trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.donationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership Distribution</CardTitle>
                <CardDescription>Breakdown by membership type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.membershipStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.membershipStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Overall financial performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Donations:</span>
                  <span className="text-lg font-bold">${reportData.financialSummary.total?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Donation:</span>
                  <span className="text-lg font-bold">${reportData.financialSummary.average?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Donations:</span>
                  <span className="text-lg font-bold">{reportData.financialSummary.count || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donations by Type</CardTitle>
                <CardDescription>Breakdown by donation category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.financialSummary.byType || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="membership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membership Statistics</CardTitle>
              <CardDescription>Detailed membership breakdown and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.membershipStats.map((stat, index) => (
                  <div key={stat.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="font-medium">{stat.type}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">{stat.percentage}%</Badge>
                      <span className="font-bold">{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>Service and event attendance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportData.attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="members" stackId="a" fill="hsl(var(--primary))" name="Members" />
                  <Bar dataKey="visitors" stackId="a" fill="hsl(var(--accent))" name="Visitors" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;