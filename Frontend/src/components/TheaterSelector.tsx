import { Theater } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TheaterSelectorProps {
  theaters: Theater[];
  selectedTheaterId: string | null;
  onSelect: (theaterId: string) => void;
}

export function TheaterSelector({ theaters, selectedTheaterId, onSelect }: TheaterSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {theaters.map((theater) => (
        <Card
          key={theater.id}
          className={cn(
            'cursor-pointer transition-all hover:shadow-md',
            selectedTheaterId === theater.id && 'ring-2 ring-primary shadow-md'
          )}
          onClick={() => onSelect(theater.id)}
        >
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{theater.name}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{theater.location}, {theater.city}</span>
              </div>
              {theater.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{theater.contact_phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
