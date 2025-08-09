import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { backend } from "@/integrations/backend/client";
import { 
  User, 
  Mail, 
  Save, 
  Upload, 
  Activity,
  FileText,
  Settings,
  AlertCircle
} from "lucide-react";

function ChangeEmailForm() {
  const { user, reloadUser } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { user: updated } = await backend.changeEmail(newEmail, password);
      toast({ title: 'Email updated', description: `Your email is now ${updated.email}` });
      await reloadUser();
      setNewEmail("");
      setPassword("");
    } catch (err: any) {
      toast({ title: 'Failed to change email', description: err.message || 'Error', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 p-4 border rounded-md">
      <div>
        <Label htmlFor="new_email">New Email</Label>
        <Input id="new_email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder={user?.email || 'you@example.com'} required />
      </div>
      <div>
        <Label htmlFor="current_password">Current Password</Label>
        <Input id="current_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" disabled={submitting || !newEmail || !password} className="w-full">
        {submitting ? 'Updating...' : 'Change Email'}
      </Button>
    </form>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please confirm your new password.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await backend.changePassword(currentPassword, newPassword);
      toast({ title: 'Password updated', description: 'Your password has been changed.' });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: 'Failed to change password', description: err.message || 'Error', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 p-4 border rounded-md">
      <div>
        <Label htmlFor="cur_pass">Current Password</Label>
        <Input id="cur_pass" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="new_pass">New Password</Label>
        <Input id="new_pass" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
      </div>
      <div>
        <Label htmlFor="confirm_pass">Confirm New Password</Label>
        <Input id="confirm_pass" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} required />
      </div>
      <Button type="submit" disabled={submitting || !currentPassword || !newPassword || !confirmPassword} className="w-full">
        {submitting ? 'Updating...' : 'Change Password'}
      </Button>
    </form>
  );
}
interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  skin_type: string | null;
  medical_history: string | null;
  notifications: boolean;
  data_sharing: boolean;
  created_at: string;
  updated_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    skin_type: '',
    medical_history: '',
    notifications: true,
    data_sharing: false
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      loadAnalysisCount();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const data = await backend.getMyProfile();
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        date_of_birth: data.date_of_birth || '',
        skin_type: data.skin_type || '',
        medical_history: data.medical_history || '',
        notifications: data.notifications ?? true,
        data_sharing: data.data_sharing ?? false
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalysisCount = () => {
    const history = localStorage.getItem('skinAnalysisHistory');
    if (history) {
      const parsedHistory = JSON.parse(history);
      setAnalysisCount(parsedHistory.length);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await backend.updateMyProfile({
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth || null,
        skin_type: formData.skin_type,
        medical_history: formData.medical_history,
        notifications: formData.notifications,
        data_sharing: formData.data_sharing
      } as any);
      toast({ title: "Success", description: "Profile updated successfully" });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large", 
        description: "Please select an image under 5MB",
        variant: "destructive"
      });
      return;
    }

    setAvatarUploading(true);
    try {
      await backend.uploadAvatar(file);
      toast({ title: "Success", description: "Profile picture updated successfully" });
      fetchProfile();
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({ title: "Error", description: error.message || "Failed to upload profile picture", variant: "destructive" });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      await backend.removeAvatar();
      toast({ title: 'Removed', description: 'Profile photo removed' });
      fetchProfile();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to remove photo', variant: 'destructive' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            <User className="w-4 h-4 mr-2" />
            User Profile
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-xl text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="card-modern border-primary/20 shadow-medical hover:shadow-ai transition-all duration-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {profile?.full_name || 'User'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={avatarUploading}
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 hover:shadow-primary/20 hover:shadow-lg transition-all duration-300"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {avatarUploading ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                  {profile?.avatar_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAvatarRemove}
                      className="ml-2"
                    >
                      Remove Photo
                    </Button>
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern border-primary/20 shadow-medical hover:shadow-ai transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Account Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Scans</span>
                  <span className="font-semibold">{analysisCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-semibold">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="card-modern border-primary/20 shadow-medical hover:shadow-ai transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <Button 
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skin_type">Skin Type</Label>
                  <Input
                    id="skin_type"
                    name="skin_type"
                    value={formData.skin_type}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g., Oily, Dry, Combination, Sensitive"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical_history">Medical History (Optional)</Label>
                  <Textarea
                    id="medical_history"
                    name="medical_history"
                    value={formData.medical_history}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Any relevant skin conditions, allergies, or medical history..."
                    rows={4}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Preferences</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your analyses and health tips
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve our AI by sharing anonymized data
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="data_sharing"
                      checked={formData.data_sharing}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                {isEditing && (
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="w-full btn-ai hover:scale-105 transition-all duration-300"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="card-modern border-primary/20 shadow-medical hover:shadow-ai transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>Account Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Badge variant="secondary">Verified</Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ChangeEmailForm />
                  <ChangePasswordForm />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-warning/30 bg-gradient-to-r from-warning/5 to-destructive/5 hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive mb-2">Important Medical Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      This profile information helps provide personalized AI analysis but should never replace professional medical consultation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}