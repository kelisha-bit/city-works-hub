import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface Donation {
  id: string;
  amount: number;
  donor_name: string;
  donation_type: string;
  payment_method: string;
  donation_date: string;
  created_at: string;
  reference_number: string;
  notes: string;
}

const AdminFinancials = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [donations, typeFilter, monthFilter]);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDonations = () => {
    let filtered = donations;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(d => d.donation_type === typeFilter);
    }

    if (monthFilter !== 'all') {
      const targetMonth = new Date().getMonth() - parseInt(monthFilter);
      const targetDate = new Date();
      targetDate.setMonth(targetMonth);
      
      filtered = filtered.filter(d => {
        const donationDate = new Date(d.donation_date);
        return donationDate.getMonth() === targetDate.getMonth() && 
               donationDate.getFullYear() === targetDate.getFullYear();
      });
    }

    setFilteredDonations(filtered);
  };

  const calculateStats = () => {
    const total = filteredDonations.reduce((sum, d) => sum + Number(d.amount), 0);
    const tithe = filteredDonations.filter(d => d.donation_type === 'tithe').reduce((sum, d) => sum + Number(d.amount), 0);
    const offering = filteredDonations.filter(d => d.donation_type === 'offering').reduce((sum, d) => sum + Number(d.amount), 0);
    const missions = filteredDonations.filter(d => d.donation_type === 'missions').reduce((sum, d) => sum + Number(d.amount), 0);

    return { total, tithe, offering, missions };
  };

  const getDonationTypeColor = (type: string) => {
    switch (type) {
      case 'tithe': return 'bg-green-500';
      case 'offering': return 'bg-blue-500';
      case 'missions': return 'bg-purple-500';
      case 'building_fund': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return '💵';
      case 'card': return '💳';
      case 'bank_transfer': return '🏦';
      case 'mobile_money': return '📱';
      default: return '💰';
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
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
        <h1 className="text-3xl font-bold text-primary">Financial Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Add Donation
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tithe">Tithe</SelectItem>
                <SelectItem value="offering">Offering</SelectItem>
                <SelectItem value="missions">Missions</SelectItem>
                <SelectItem value="building_fund">Building Fund</SelectItem>
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="0">This Month</SelectItem>
                <SelectItem value="1">Last Month</SelectItem>
                <SelectItem value="2">2 Months Ago</SelectItem>
                <SelectItem value="3">3 Months Ago</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">${stats.total.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Donations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">${stats.tithe.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Tithe</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">${stats.offering.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Offerings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">${stats.missions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Missions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {getPaymentMethodIcon(donation.payment_method)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{donation.donor_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(donation.donation_date), 'MMM dd, yyyy')} • 
                      Ref: {donation.reference_number || 'N/A'}
                    </p>
                    {donation.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{donation.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${Number(donation.amount).toLocaleString()}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className={getDonationTypeColor(donation.donation_type)}>
                      {donation.donation_type}
                    </Badge>
                    <Badge variant="secondary">
                      {donation.payment_method}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDonations.length === 0 && !loading && (
            <div className="p-8 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No donations found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or add a new donation.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinancials;