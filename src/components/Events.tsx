import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Heart,
  Music,
  BookOpen,
  UserPlus
} from 'lucide-react';

const Events = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const events = [
    {
      id: 1,
      title: "Sunday Worship Service",
      description: "Join us for an inspiring worship service with powerful music and a life-changing message.",
      date: "2024-12-08",
      time: "10:00 AM - 12:00 PM",
      location: "Main Sanctuary",
      type: "service",
      maxAttendees: 500,
      currentAttendees: 380,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Bible Study: Walking in Faith",
      description: "Deep dive into Scripture exploring what it means to live by faith in today's world.",
      date: "2024-12-10",
      time: "7:00 PM - 8:30 PM",
      location: "Fellowship Hall",
      type: "study",
      maxAttendees: 50,
      currentAttendees: 32,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Youth Night: Game Night & Devotion",
      description: "Fun games, snacks, and meaningful discussions about faith for our young people.",
      date: "2024-12-12",
      time: "6:00 PM - 9:00 PM",
      location: "Youth Center",
      type: "youth",
      maxAttendees: 80,
      currentAttendees: 45,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Christmas Carol Service",
      description: "Celebrate the birth of Christ with traditional carols and a special Christmas message.",
      date: "2024-12-24",
      time: "6:00 PM - 8:00 PM",
      location: "Main Sanctuary",
      type: "special",
      maxAttendees: 600,
      currentAttendees: 250,
      image: "/placeholder.svg"
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'service':
        return <Heart className="h-4 w-4" />;
      case 'study':
        return <BookOpen className="h-4 w-4" />;
      case 'youth':
        return <Users className="h-4 w-4" />;
      case 'special':
        return <Music className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'service':
        return 'bg-primary text-primary-foreground';
      case 'study':
        return 'bg-accent text-accent-foreground';
      case 'youth':
        return 'bg-success text-success-foreground';
      case 'special':
        return 'bg-gradient-gold text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-subtle rounded-lg p-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Church Events</h1>
        <p className="text-muted-foreground">
          Stay connected with our church community through upcoming events and services
        </p>
      </div>

      {/* View Toggle */}
      <Tabs value={view} onValueChange={(value) => setView(value as 'list' | 'calendar')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getEventTypeColor(event.type)}>
                        {getEventIcon(event.type)}
                        <span className="ml-1 capitalize">{event.type}</span>
                      </Badge>
                      {isUpcoming(event.date) && (
                        <Badge variant="outline" className="text-success border-success">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-primary">{event.title}</CardTitle>
                    <CardDescription className="mt-2">{event.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                {/* Attendance Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <UserPlus className="h-4 w-4" />
                    <span className="text-sm">
                      {event.currentAttendees}/{event.maxAttendees} registered
                    </span>
                  </div>
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(event.currentAttendees / event.maxAttendees) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {isUpcoming(event.date) ? (
                    <>
                      <Button variant="hero" size="sm">
                        Register / RSVP
                      </Button>
                      <Button variant="outline" size="sm">
                        Add to Calendar
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-primary">Calendar View</CardTitle>
              <CardDescription>
                Interactive calendar view coming soon! For now, check out the list view above.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-subtle rounded-lg p-8 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-primary mb-2">Calendar View</h3>
                <p className="text-muted-foreground mb-4">
                  We're working on bringing you a beautiful calendar interface. 
                  Meanwhile, explore our events in the list view.
                </p>
                <Button variant="outline" onClick={() => setView('list')}>
                  View Event List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;