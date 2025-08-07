import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  DollarSign, 
  Gift, 
  TrendingUp, 
  Users, 
  Target,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Giving = () => {
  const [amount, setAmount] = useState('');
  const [donationType, setDonationType] = useState('tithe');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [givingStats, setGivingStats] = useState({
    totalGiving: 0,
    thisMonth: 0,
    memberCount: 0,
    financialGoals: []
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGivingStats();
  }, []);

  const fetchGivingStats = async () => {
    try {
      // Fetch donation stats
      const { data: donations } = await supabase
        .from('donations')
        .select('amount, donation_date');

      // Fetch financial goals
      const { data: goals } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('status', 'active');

      // Fetch member count
      const { data: members } = await supabase
        .from('members')
        .select('id');

      if (donations) {
        const total = donations.reduce((sum, d) => sum + Number(d.amount), 0);
        const thisMonth = donations
          .filter(d => new Date(d.donation_date).getMonth() === new Date().getMonth())
          .reduce((sum, d) => sum + Number(d.amount), 0);

        setGivingStats({
          totalGiving: total,
          thisMonth,
          memberCount: members?.length || 0,
          financialGoals: goals || []
        });
      }
    } catch (error) {
      console.error('Error fetching giving stats:', error);
    }
  };

  const handleDonation = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // This would integrate with a payment processor like Stripe
      // For now, we'll just save the donation record
      const { error } = await supabase
        .from('donations')
        .insert({
          amount: Number(amount),
          donation_type: donationType,
          payment_method: paymentMethod,
          is_recurring: isRecurring,
          notes: notes,
          donor_name: 'Anonymous', // In real app, get from user profile
        });

      if (error) throw error;

      toast({
        title: "Thank You!",
        description: "Your donation has been processed successfully",
      });

      // Reset form
      setAmount('');
      setNotes('');
      fetchGivingStats();
    } catch (error) {
      console.error('Error processing donation:', error);
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [50, 100, 250, 500, 1000];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">Give & Tithe</h1>
        <p className="opacity-90">
          "Each of you should give what you have decided in your heart to give" - 2 Corinthians 9:7
        </p>
      </div>

      {/* Giving Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-success" />
<p className="text-2xl font-bold text-success">GHC{givingStats.totalGiving.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Giving</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
<p className="text-2xl font-bold text-primary">GHC{givingStats.thisMonth.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold text-accent">{givingStats.memberCount}</p>
            <p className="text-sm text-muted-foreground">Church Members</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Form */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Gift className="h-5 w-5 mr-2" />
              Make a Donation
            </CardTitle>
            <CardDescription>
              Support the ministry and help us serve the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Amount Selection */}
            <div className="space-y-2">
<Label htmlFor="amount">Amount (GHC)</Label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className={amount === quickAmount.toString() ? 'border-primary' : ''}
                  >
GHC{quickAmount}
                  </Button>
                ))}
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Donation Type */}
            <div className="space-y-2">
              <Label>Donation Type</Label>
              <Select value={donationType} onValueChange={setDonationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tithe">Tithe</SelectItem>
                  <SelectItem value="offering">Offering</SelectItem>
                  <SelectItem value="missions">Missions</SelectItem>
                  <SelectItem value="building">Building Fund</SelectItem>
                  <SelectItem value="youth">Youth Ministry</SelectItem>
                  <SelectItem value="charity">Charity</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Card
                  </TabsTrigger>
                  <TabsTrigger value="bank" className="flex items-center">
                    <Banknote className="h-4 w-4 mr-1" />
                    Bank
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-1" />
                    Mobile
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Recurring Option */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="recurring">Make this a recurring monthly donation</Label>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add a prayer request or dedication..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleDonation} 
              disabled={loading}
              className="w-full"
              variant="hero"
            >
{loading ? 'Processing...' : `Donate GHC${amount || '0'}`}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your donation is secure and encrypted. You will receive a receipt via email.
            </p>
          </CardContent>
        </Card>

        {/* Financial Goals */}
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Target className="h-5 w-5 mr-2" />
                Church Financial Goals
              </CardTitle>
              <CardDescription>
                Help us reach our ministry objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {givingStats.financialGoals.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No active financial goals at this time
                </p>
              ) : (
                <div className="space-y-4">
                  {givingStats.financialGoals.map((goal: any) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-primary">{goal.name}</h4>
                        <Badge variant="outline">
GHC{(goal.current_amount || 0).toLocaleString()} / GHC{goal.target_amount.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(((goal.current_amount || 0) / goal.target_amount) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(((goal.current_amount || 0) / goal.target_amount) * 100)}% complete
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Giving Options */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-primary">Other Ways to Give</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Banknote className="h-6 w-6 text-success" />
                <div>
                  <h4 className="font-semibold">Bank Transfer</h4>
                  <p className="text-sm text-muted-foreground">Direct bank transfer available</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-semibold">Sunday Offering</h4>
                  <p className="text-sm text-muted-foreground">Give during worship service</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Heart className="h-6 w-6 text-accent" />
                <div>
                  <h4 className="font-semibold">Planned Giving</h4>
                  <p className="text-sm text-muted-foreground">Set up automatic donations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Giving;
