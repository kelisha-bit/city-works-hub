import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  event_type: string;
  current_attendees: number;
  max_attendees: number;
  registration_required: boolean;
  created_at: string;
  image_url: string;
}

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-500';
      case 'study': return 'bg-green-500';
      case 'youth': return 'bg-purple-500';
      case 'special': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isUpcoming = (date: string) => {
    return new Date(date) >= new Date();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
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
        <h1 className="text-3xl font-bold text-primary">Event Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{events.length}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {events.filter(e => isUpcoming(e.event_date)).length}
                </p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {events.reduce((sum, e) => sum + (e.current_attendees || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Attendees</p>
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
                  {events.filter(e => e.registration_required).length}
                </p>
                <p className="text-sm text-muted-foreground">Require Registration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover-scale">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.event_date), 'MMM dd, yyyy')}
                    </div>
                    {event.start_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(event.start_time)}
                        {event.end_time && ` - ${formatTime(event.end_time)}`}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-3">
                {event.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
                      {event.event_type}
                    </Badge>
                    {event.registration_required && (
                      <Badge variant="secondary">Registration Required</Badge>
                    )}
                    {isUpcoming(event.event_date) && (
                      <Badge variant="default">Upcoming</Badge>
                    )}
                  </div>
                </div>

                {event.max_attendees && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.current_attendees || 0} / {event.max_attendees} attendees</span>
                    <div className="flex-1 bg-muted rounded-full h-2 ml-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(((event.current_attendees || 0) / event.max_attendees) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Manage Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No events found</h3>
            <p className="text-muted-foreground">Create your first event to get started.</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create First Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminEvents;