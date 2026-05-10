"use client";

import { useState } from "react";
import { Settings, Shield, Key, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error?.message || "Failed to update password");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) return toast.error("Please enter your password to confirm");
    
    if (!confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and all your trips will be lost forever.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Account deleted successfully");
        // Clear local auth token if we have one
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/auth/login");
      } else {
        toast.error(data.error?.message || "Failed to delete account");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)] flex items-center">
          <Settings className="mr-3 h-8 w-8 text-[var(--accent)]" />
          Settings
        </h1>
        <p className="text-[var(--primary-muted)] mt-1">Manage your account security and preferences.</p>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
          <Shield className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800">Security</h2>
        </div>
        
        <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
              <Key className="mr-2 h-4 w-4" /> Change Password
            </h3>
            
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input 
                  type="password" 
                  required 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input 
                  type="password" 
                  required 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
                  title="Must contain at least one number and one uppercase and lowercase letter, one special character, and at least 8 or more characters"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input 
                  type="password" 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
              
              <Button type="submit" className="btn-accent w-full" disabled={isChangingPassword}>
                {isChangingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Danger Zone Section */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
        <div className="p-6 border-b border-red-100 bg-red-50 flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Danger Zone</h2>
        </div>
        
        <div className="p-6">
          <h3 className="text-md font-medium text-gray-800 mb-2">Delete Account</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xl">
            Once you delete your account, there is no going back. All of your trips, expenses, and personal information will be permanently deleted. Please be certain.
          </p>
          
          <form onSubmit={handleDeleteAccount} className="max-w-md space-y-4 p-4 border border-red-100 rounded-lg bg-red-50/30">
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-800">Confirm with your password</label>
              <Input 
                type="password" 
                required 
                placeholder="Enter password to confirm"
                value={deletePassword} 
                onChange={(e) => setDeletePassword(e.target.value)} 
                className="border-red-200 focus-visible:ring-red-500"
              />
            </div>
            <Button type="submit" variant="destructive" className="w-full bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Permanently Delete My Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
