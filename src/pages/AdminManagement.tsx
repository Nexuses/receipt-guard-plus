import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, User, Shield } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

const AdminManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (userEmail: string, userId: string) => {
    setPromoting(userId);
    try {
      const { error } = await supabase.rpc('promote_user_to_admin', {
        user_email: userEmail
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully promoted ${userEmail} to admin`,
      });

      // Refresh the profiles list
      fetchProfiles();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: "Error",
        description: "Failed to promote user to admin",
        variant: "destructive",
      });
    } finally {
      setPromoting(null);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'manager':
      case 'finance_admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'finance_admin':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Crown className="h-4 w-4" />
          Admin Panel
        </Badge>
      </div>

      <div className="grid gap-4">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {profile.full_name?.charAt(0) || profile.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{profile.full_name || 'No name'}</h3>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={`flex items-center gap-1 ${getRoleColor(profile.role)}`}>
                    {getRoleIcon(profile.role)}
                    {profile.role}
                  </Badge>
                  
                  {profile.role !== 'admin' && profile.id !== user?.id && (
                    <Button
                      onClick={() => promoteToAdmin(profile.email, profile.id)}
                      disabled={promoting === profile.id}
                      size="sm"
                      variant="outline"
                    >
                      {promoting === profile.id ? (
                        "Promoting..."
                      ) : (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          Make Admin
                        </>
                      )}
                    </Button>
                  )}
                  
                  {profile.role === 'admin' && (
                    <Badge variant="secondary">Current Admin</Badge>
                  )}
                  
                  {profile.id === user?.id && (
                    <Badge variant="secondary">You</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {profiles.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Users Found</CardTitle>
            <CardDescription>
              No user profiles found in the system.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default AdminManagement;