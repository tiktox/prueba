
"use client";

import type { PastEvent } from "@/types/event";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Film, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface PastEventGalleryItemProps {
  event: PastEvent;
}

export default function PastEventGalleryItem({ event }: PastEventGalleryItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
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
        </div>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">{event.name}</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {event.date}
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-3">{event.summary}</p>
          {event.achievements && (
             <div className="flex items-start text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <span>{event.achievements}</span>
            </div>
          )}
          {event.videoUrl && (
            <div className="mt-2">
              <video
                src={event.videoUrl}
                controls
                className="w-full rounded-md aspect-video"
                poster={event.image} // Use main image as poster
              >
                Tu navegador no soporta videos HTML5.
              </video>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
