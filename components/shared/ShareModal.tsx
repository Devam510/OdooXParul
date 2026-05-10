"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Copy, Check, Link2, Globe, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ShareModal({ isOpen, onClose, tripId }: { isOpen: boolean, onClose: () => void, tripId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [shareData, setShareData] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchShareStatus();
    } else {
      setIsCopied(false);
    }
  }, [isOpen]);

  const fetchShareStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/share`);
      const data = await res.json();
      if (res.ok && data.data) {
        setShareData(data.data);
      } else {
        setShareData(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setShareData(data.data);
        toast.success("Share link created!");
      } else {
        toast.error(data.error?.message || "Failed to create share link");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (isActive: boolean) => {
    try {
      setShareData({ ...shareData, isActive });
      const res = await fetch(`/api/trips/${tripId}/share`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive })
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Sharing ${isActive ? 'enabled' : 'disabled'}`);
    } catch (e: any) {
      setShareData({ ...shareData, isActive: !isActive }); // revert
      toast.error(e.message);
    }
  };

  const handleRevoke = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to revoke link");
      setShareData(null);
      toast.success("Share link revoked permanently");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const shareUrl = shareData ? `${window.location.origin}/shared/${shareData.shareToken}` : "";

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent("Check out my upcoming trip itinerary on Traveloop!");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out my upcoming trip itinerary on Traveloop! ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5 text-blue-500" />
            Share Trip
          </DialogTitle>
          <DialogDescription>
            Create a public, read-only link to share your itinerary with friends or family. 
            Private notes and specific expenses will be hidden.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading && !shareData ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
            </div>
          ) : !shareData ? (
            <div className="text-center space-y-4 py-6">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Link2 className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-sm text-[var(--primary-muted)]">No share link exists for this trip yet.</p>
              <Button onClick={handleGenerateLink} className="btn-accent" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
                Generate Public Link
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-gray-900">Link Active</label>
                  <p className="text-xs text-gray-500">Anyone with the link can view</p>
                </div>
                <Switch 
                  checked={shareData.isActive} 
                  onCheckedChange={handleToggleActive}
                />
              </div>

              <div className={`space-y-3 transition-opacity ${!shareData.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                <label className="text-sm font-medium">Public URL</label>
                <div className="flex space-x-2">
                  <Input value={shareUrl} readOnly className="bg-gray-50 font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={handleCopy} className="shrink-0">
                    {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleTwitterShare}>
                    𝕏 Twitter
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleWhatsAppShare}>
                    WhatsApp
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleRevoke}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Revoke Link
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
