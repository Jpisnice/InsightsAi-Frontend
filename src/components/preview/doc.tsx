"use client"
import { PageProps, Page } from "./Page";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Lock, Unlock } from "lucide-react";

interface DocProps {
    doc: PageProps[],
    docName: string,
    docType: string,
    docSize: number,
    docPages: number,
    currentPage?: number,
}

export const Doc = ({
    doc,
    docName,
    docType,
    docSize,
    docPages,
    currentPage = 1,
}: DocProps) => {
    // Just use a single state for UI changes to avoid remounts of main component
    const [isLocked, setIsLocked] = useState(false);
    
    // Toggle lock handler
    const toggleLock = () => {
        setIsLocked(!isLocked);
    };
  
    return (
        <div className="relative flex flex-col items-center m-4">
            {/* Lock toggle button positioned at top right */}
            
            <div className="mb-1 w-full max-w-3xl">
                <h2 className="text-xl font-semibold">{docName}</h2>
                <div className="text-sm text-gray-500 flex gap-2">
                    <span>{docType} • {Math.round(docSize / 1024)} KB • {docPages} pages</span>
                </div>
                
            </div>
            <div className="flex items-center gap-2">
                   
                    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLock}
                        className="flex items-center gap-1"
                    >
                        {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
        </TooltipTrigger>
        <TooltipContent>
            {isLocked ? <p>Unlock Horizonal scroll</p>:<p>Lock Horizonal scroll</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
                </div>
            <Carousel
              className="w-full max-w-3xl p-2"
              opts={{
                dragThreshold: 10,
                watchDrag: !isLocked, // Pass the lock state directly to opts
              }}
            >
              <CarouselContent>
                {doc.map((page, index) => (
                  <CarouselItem key={index}>
                    <Page {...page} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        </div>
    );
};

