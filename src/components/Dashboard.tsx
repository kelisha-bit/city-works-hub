import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Heart, 
  Music, 
  Users, 
  DollarSign, 
  BookOpen,
  Clock,
  MapPin,
  Gift,
  HandHeart
} from 'lucide-react';

interface DashboardProps {
  user: any;
  onViewChange?: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onViewChange }) => {
  const todaysScripture = {
    verse: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
    reference: "Jeremiah 29:11"
  };

  const upcomingEvents = [
    {
      id: 1,
      title: "Sunday Worship Service",
      date: "2024-12-08",
      time: "10:00 AM",
      location: "Main Sanctuary",
      type: "service"
    },
    {
      id: 2,
      title: "Bible Study",
      date: "2024-12-10",
      time: "7:00 PM",
      location: "Fellowship Hall",
      type: "study"
    },
    {
      id: 3,
      title: "Youth Meeting",
      date: "2024-12-12",
      time: "6:00 PM",
      location: "Youth Center",
      type: "youth"
    }
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: "Christmas Service Schedule",
      content: "Join us for special Christmas services on December 24th and 25th.",
      date: "2024-12-05"
    },
    {
      id: 2,
      title: "New Member Registration",
      content: "New member classes start this Sunday after service.",
      date: "2024-12-04"
    }
  ];

  const quickStats = {
    totalDonations: "₦45,000",
    prayerRequests: 12,
    upcomingEvents: 3,
    members: 450
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.user_metadata?.first_name || 'Friend'}!
        </h1>
        <p className="opacity-90">
          Ready to grow in faith and serve the community today?
        </p>
      </div>

      {/* Today's Scripture */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <BookOpen className="h-5 w-5 mr-2" />
            Today's Scripture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
            "{todaysScripture.verse}"
          </blockquote>
          <p className="text-right mt-2 font-semibold text-accent">
            - {todaysScripture.reference}
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold text-success">{quickStats.totalDonations}</p>
            <p className="text-sm text-muted-foreground">Total Giving</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <HandHeart className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-primary">{quickStats.prayerRequests}</p>
            <p className="text-sm text-muted-foreground">Prayer Requests</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold text-accent">{quickStats.upcomingEvents}</p>
            <p className="text-sm text-muted-foreground">Upcoming Events</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary-light" />
            <p className="text-2xl font-bold text-primary-light">{quickStats.members}</p>
            <p className="text-sm text-muted-foreground">Church Members</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Don't miss these upcoming church events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary">{event.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="ml-4">
                  {new Date(event.date).toLocaleDateString()}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={() => onViewChange?.('events')}>
            View All Events
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
          <CardDescription>Access frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="worship" className="h-20 flex-col" onClick={() => onViewChange?.('giving')}>
              <Gift className="h-6 w-6 mb-2" />
              Give
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => onViewChange?.('sermons')}>
              <Music className="h-6 w-6 mb-2" />
              Sermons
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => onViewChange?.('prayer')}>
              <Heart className="h-6 w-6 mb-2" />
              Prayer
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => onViewChange?.('connect')}>
              <Users className="h-6 w-6 mb-2" />
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-primary">Church Announcements</CardTitle>
          <CardDescription>Stay updated with the latest news</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-2">{announcement.title}</h3>
                <p className="text-muted-foreground mb-2">{announcement.content}</p>
                <p className="text-sm text-accent">
                  {new Date(announcement.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;