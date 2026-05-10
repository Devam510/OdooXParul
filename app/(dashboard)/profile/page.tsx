"use client";

import { useState, useEffect } from "react";
import { User, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { TravelStyleSelector } from "@/components/profile/TravelStyleSelector";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/users/me");
      const data = await res.json();
      if (res.ok) {
        setProfile(data.data);
      } else {
        toast.error(data.error?.message || "Failed to load profile");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile.fullName,
          username: profile.username,
          bio: profile.bio,
          travelStyle: profile.travelStyle,
          avatar: profile.avatar,
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setProfile(data.data);
        // Dispatch an event to update navbar if we were using a global state, or just reload
        // router.refresh(); // Or a custom event
      } else {
        toast.error(data.error?.message || "Failed to update profile");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)] flex items-center">
          <User className="mr-3 h-8 w-8 text-[var(--accent)]" />
          Your Profile
        </h1>
        <p className="text-[var(--primary-muted)] mt-1">Manage your personal information and travel preferences.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          <div>
            <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">Profile Photo</h3>
            <AvatarUpload 
              currentAvatar={profile.avatar} 
              onUpload={(base64) => setProfile({ ...profile, avatar: base64 })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                value={profile.fullName || ""} 
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input 
                value={profile.username || ""} 
                onChange={(e) => setProfile({ ...profile, username: e.target.value })} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input value={profile.email} disabled className="bg-gray-50 text-gray-500" />
            <p className="text-xs text-gray-500">Email cannot be changed directly.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea 
              value={profile.bio || ""} 
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
              placeholder="Tell others about yourself..."
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Travel Style</label>
            <p className="text-xs text-gray-500 mb-2">How do you prefer to travel?</p>
            <TravelStyleSelector 
              value={profile.travelStyle || ""} 
              onChange={(val) => setProfile({ ...profile, travelStyle: val })} 
            />
          </div>

        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
          <Button type="submit" className="btn-accent" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
