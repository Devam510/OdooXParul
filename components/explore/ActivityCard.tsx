import { useState } from "react";
import Image from "next/image";
import { Clock, MapPin, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { AddToTripModal } from "@/components/explore/AddToTripModal";

export function ActivityCard({ activity }: { activity: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock image if not provided
  const imageUrl = activity.imageUrl || activity.image || "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800&q=80";

  return (
    <>
      <div className="card overflow-hidden flex flex-col group">
        <div className="relative h-40 w-full overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={activity.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider text-[var(--primary)] shadow-sm">
            {activity.category || "Activity"}
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-current" />
            {activity.rating?.toFixed(1) || "4.8"}
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-[var(--primary)] mb-1 line-clamp-1" title={activity.name}>
            {activity.name}
          </h3>
          
          {activity.city && (
            <p className="text-[var(--primary-muted)] text-sm flex items-center mb-3">
              <MapPin className="h-3 w-3 mr-1" /> {activity.city.name}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-[var(--primary-muted)] mb-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {activity.durationMinutes ? `${Math.floor(activity.durationMinutes / 60)}h ${activity.durationMinutes % 60}m` : "Varies"}
            </div>
            <div className="font-semibold text-[var(--primary)]">
              {activity.estimatedCost ? formatCurrency(activity.estimatedCost) : "Free"}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-[var(--border)]">
            <Button 
              variant="outline" 
              className="w-full group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-[var(--accent)] transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Trip
            </Button>
          </div>
        </div>
      </div>

      <AddToTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        activity={activity} 
      />
    </>
  );
}
