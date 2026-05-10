import { useState } from "react";
import Image from "next/image";
import { MapPin, DollarSign, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToTripModal } from "@/components/explore/AddToTripModal";
import Link from "next/link";

export function CityCard({ city }: { city: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock image if not provided
  const imageUrl = city.imageUrl || city.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80";

  return (
    <>
      <div className="card overflow-hidden flex flex-col group">
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={city.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-current" />
            {city.popularity?.toFixed(1) || "4.5"}
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-[var(--primary)]">{city.name}</h3>
              <p className="text-[var(--primary-muted)] text-sm flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" /> {city.country}
              </p>
            </div>
            <div className="flex text-green-600">
              {Array.from({ length: city.costIndex || 2 }).map((_, i) => (
                <DollarSign key={i} className="h-4 w-4 -ml-1" />
              ))}
            </div>
          </div>
          
          <p className="text-sm text-[var(--primary-muted)] mt-2 line-clamp-3 flex-1">
            {city.description}
          </p>
          
          <div className="mt-4 flex gap-2">
            <Button className="flex-1 btn-accent" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add to Trip
            </Button>
            {/* <Button variant="outline" asChild>
              <Link href={`/explore/cities/${city.id}`}>Details</Link>
            </Button> */}
          </div>
        </div>
      </div>
      
      <AddToTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        city={city} 
      />
    </>
  );
}
