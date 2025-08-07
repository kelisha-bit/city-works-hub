import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Download, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  BookOpen,
  Music,
  Video,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Sermons = () => {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setSermons(data || []);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      toast({
        title: "Error",
        description: "Failed to load sermons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.preacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.scripture_reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sermon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(sermons.map(s => s.category).filter(Boolean))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <h1 className="text-3xl font-bold mb-2">Sermon Library</h1>
        <p className="opacity-90">
          Explore our collection of inspiring messages and biblical teachings
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search sermons, speakers, or scripture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category === 'all' ? 'All Categories' : category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Sermons Grid */}
      {filteredSermons.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-primary mb-2">No Sermons Found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms.' : 'Sermons will appear here when available.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon) => (
            <Card key={sermon.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {sermon.category || 'General'}
                  </Badge>
                  {sermon.duration && (
                    <div className="flex items-center text-muted-foreground text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {sermon.duration}
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg text-primary leading-tight">
                  {sermon.title}
                </CardTitle>
                {sermon.scripture_reference && (
                  <div className="flex items-center text-sm text-accent">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {sermon.scripture_reference}
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {sermon.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {sermon.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {sermon.preacher || 'Pastor'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {sermon.date ? formatDate(sermon.date) : 'Recent'}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    {sermon.audio_url && (
                      <Button size="sm" className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Listen
                      </Button>
                    )}
                    {sermon.video_url && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Video className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                    )}
                    {sermon.notes_url && (
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    {(sermon.audio_url || sermon.video_url) && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sermons;