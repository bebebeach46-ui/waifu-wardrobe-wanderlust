import { useEffect, useState } from "react";
import { Weather } from "@/lib/weatherGenerator";
import { StatusEffect } from "@/lib/statusEffectGenerator";
import { Event } from "@/lib/eventLogGenerator";

export type TickerEventType = 
  | 'weather' 
  | 'negative' 
  | 'positive' 
  | 'legendary';

export interface TickerEvent {
  id: string;
  text: string;
  type: TickerEventType;
  timestamp: number;
  icon?: string;
}

interface EventTickerProps {
  weather: Weather;
  statusEffects: StatusEffect[];
  eventLog: Event[];
  recentEvents: TickerEvent[];
}

const getEventColor = (type: TickerEventType): string => {
  switch (type) {
    case 'weather':
      return 'text-muted-foreground';
    case 'negative':
      return 'text-destructive';
    case 'positive':
      return 'text-blue-400';
    case 'legendary':
      return 'text-amber-400 font-bold';
    default:
      return 'text-foreground';
  }
};

const getEventBgColor = (type: TickerEventType): string => {
  switch (type) {
    case 'weather':
      return 'bg-muted/50';
    case 'negative':
      return 'bg-destructive/10';
    case 'positive':
      return 'bg-blue-500/10';
    case 'legendary':
      return 'bg-amber-500/20 animate-pulse';
    default:
      return 'bg-muted';
  }
};

export const EventTicker = ({ weather, statusEffects, eventLog, recentEvents }: EventTickerProps) => {
  const [displayedEvents, setDisplayedEvents] = useState<TickerEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine all events into the ticker
  useEffect(() => {
    const allEvents: TickerEvent[] = [];

    // Add weather as persistent event
    allEvents.push({
      id: `weather-${weather.name}`,
      text: `${weather.icon} ${weather.name}: ${weather.effect}`,
      type: 'weather',
      timestamp: Date.now(),
      icon: weather.icon
    });

    // Add status effects
    statusEffects.forEach((effect, i) => {
      allEvents.push({
        id: `status-${effect.name}-${i}`,
        text: `${effect.icon} ${effect.name}: ${effect.description}`,
        type: effect.type === 'bad' ? 'negative' : 'positive',
        timestamp: Date.now() - i * 1000,
        icon: effect.icon
      });
    });

    // Add recent ticker events (legendary events, etc.)
    recentEvents.forEach(event => {
      allEvents.push(event);
    });

    // Add event log items
    eventLog.slice(0, 5).forEach((event, i) => {
      const type: TickerEventType = event.sentiment === 'negative' ? 'negative' : 
                                    event.sentiment === 'positive' ? 'positive' : 'weather';
      allEvents.push({
        id: `event-${i}-${event.text.slice(0, 20)}`,
        text: event.text,
        type,
        timestamp: Date.now() - (i + 10) * 1000
      });
    });

    // Sort by type priority (legendary first, then by timestamp)
    allEvents.sort((a, b) => {
      const priority = { legendary: 0, negative: 1, positive: 2, weather: 3 };
      const priorityDiff = priority[a.type] - priority[b.type];
      if (priorityDiff !== 0) return priorityDiff;
      return b.timestamp - a.timestamp;
    });

    setDisplayedEvents(allEvents.slice(0, 10));
  }, [weather, statusEffects, eventLog, recentEvents]);

  // Auto-rotate through events
  useEffect(() => {
    if (displayedEvents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayedEvents.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [displayedEvents.length]);

  if (displayedEvents.length === 0) return null;

  const currentEvent = displayedEvents[currentIndex];

  return (
    <div className="w-full bg-card/80 backdrop-blur-sm border-b border-border">
      {/* Main ticker display */}
      <div className={`py-2 px-4 ${getEventBgColor(currentEvent.type)} transition-all duration-500`}>
        <div className="flex items-center justify-between gap-2">
          <div className={`flex-1 text-sm truncate ${getEventColor(currentEvent.type)}`}>
            {currentEvent.type === 'legendary' && <span className="mr-1">✨</span>}
            {currentEvent.text}
            {currentEvent.type === 'legendary' && <span className="ml-1">✨</span>}
          </div>
          
          {/* Event dots indicator */}
          <div className="flex gap-1 shrink-0">
            {displayedEvents.slice(0, 5).map((event, i) => (
              <button
                key={event.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex 
                    ? getEventColor(event.type).replace('text-', 'bg-').replace('font-bold', '')
                    : 'bg-muted-foreground/30'
                } ${i === currentIndex ? 'scale-125' : 'hover:scale-110'}`}
                title={event.text}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Collapsed event list (shows on hover/focus) */}
      <div className="group relative">
        <div className="absolute top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none 
                        group-hover:pointer-events-auto z-10 max-h-48 overflow-y-auto shadow-lg">
          <div className="p-2 space-y-1">
            <div className="text-xs font-semibold text-muted-foreground px-2 pb-1 border-b border-border">
              Recent Events
            </div>
            {displayedEvents.map((event, i) => (
              <div 
                key={event.id}
                className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors
                           ${getEventBgColor(event.type)} ${getEventColor(event.type)}
                           hover:bg-muted`}
                onClick={() => setCurrentIndex(i)}
              >
                {event.type === 'legendary' && '✨ '}
                {event.text}
                {event.type === 'legendary' && ' ✨'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to create legendary events
export const createLegendaryEvent = (text: string, icon?: string): TickerEvent => ({
  id: `legendary-${Date.now()}`,
  text,
  type: 'legendary',
  timestamp: Date.now(),
  icon
});

export default EventTicker;
