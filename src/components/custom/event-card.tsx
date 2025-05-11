
"use client";

import type { UpcomingEvent } from "@/types/event";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, Link2, Users, Video } from "lucide-react";
import { motion } from "framer-motion";

interface EventCardProps {
  event: UpcomingEvent;
}

const getStatusBadgeVariant = (status: UpcomingEvent["status"]): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Próximo":
      return "default"; // Uses primary color
    case "En curso":
      return "secondary"; // Or a custom "success" variant if defined
    case "Finalizado":
      return "outline"; // Or a custom "muted" variant
    default:
      return "outline";
  }
};

const getStatusBadgeClass = (status: UpcomingEvent["status"]): string => {
    switch (status) {
      case "Próximo":
        return "bg-primary text-primary-foreground";
      case "En curso":
        return "bg-green-500 text-white"; // Ensure this color contrasts well with theme
      case "Finalizado":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };


export default function EventCard({ event }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
        <div className="relative w-full h-48">
          <Image
            src={event.image}
            alt={event.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={event.aiHint}
          />
           <Badge 
            // variant={getStatusBadgeVariant(event.status)} 
            className={`absolute top-3 right-3 text-xs font-semibold ${getStatusBadgeClass(event.status)}`}
            >
            {event.status}
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">{event.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-2 text-primary" />
              {event.date}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              {event.time}
            </div>
            <div className="flex items-center text-muted-foreground">
              {event.modality === 'Virtual' ? <Video className="h-4 w-4 mr-2 text-primary" /> : <MapPin className="h-4 w-4 mr-2 text-primary" />}
              {event.modality}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button asChild className="w-full group">
            <a href={event.locationOrLink} target="_blank" rel="noopener noreferrer">
              {event.linkText}
              <Link2 className="ml-2 h-4 w-4 group-hover:animate-pulse" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
