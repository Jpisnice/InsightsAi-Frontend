"use client"
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createSwapy, utils, Swapy, SwapEvent, SlotItemMapArray } from 'swapy';
import { DocBlock } from './docblock';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

// Define types for document items
interface DocItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  file: File | null;
}

interface ZoneProps {
  documents: DocItem[];
  priorityDocuments?: DocItem[];
  onDocumentsChange: (documents: DocItem[]) => void;
  onPriorityDocumentsChange: (priorityDocuments: DocItem[]) => void;
  onDocumentSelect?: (document: DocItem) => void;
}

export const Zone: React.FC<ZoneProps> = ({ 
  documents, 
  priorityDocuments = [], 
  onDocumentsChange,
  onPriorityDocumentsChange,
  onDocumentSelect
}) => {
  const normalContainerRef = useRef<HTMLDivElement>(null);
  const priorityContainerRef = useRef<HTMLDivElement>(null);
  const normalSwapyRef = useRef<Swapy | null>(null);
  const prioritySwapyRef = useRef<Swapy | null>(null);
  
  // State for slot-item mapping
  const [normalSlotItemMap, setNormalSlotItemMap] = useState<SlotItemMapArray>(() => 
    utils.initSlotItemMap(documents, 'id')
  );
  
  const [prioritySlotItemMap, setPrioritySlotItemMap] = useState<SlotItemMapArray>(() => 
    utils.initSlotItemMap(priorityDocuments, 'id')
  );
  
  // Memoize item IDs to ensure dependency array stays consistent
  const documentIds = useMemo(() => documents.map(doc => doc.id), [documents]);
  const priorityDocumentIds = useMemo(() => priorityDocuments.map(doc => doc.id), [priorityDocuments]);
  
  // Create slotted items based on the current state
  const normalSlottedItems = useMemo(() => 
    utils.toSlottedItems(documents, 'id', normalSlotItemMap), 
    [documents, normalSlotItemMap]
  );
  
  const prioritySlottedItems = useMemo(() => 
    utils.toSlottedItems(priorityDocuments, 'id', prioritySlotItemMap), 
    [priorityDocuments, prioritySlotItemMap]
  );

  // Initialize Swapy for normal zone
  useEffect(() => {
    if (normalContainerRef.current) {
      normalSwapyRef.current = createSwapy(normalContainerRef.current, {
        manualSwap: true,
        dropSelector: '[data-swapy-slot]'
      } as any);

      normalSwapyRef.current.onSwap((event: SwapEvent) => {
        console.log('Normal zone swap event:', event);
        setNormalSlotItemMap(event.newSlotItemMap.asArray);
      });
    }

    return () => {
      if (normalSwapyRef.current) {
        normalSwapyRef.current.destroy();
      }
    }
  }, []);

  // Initialize Swapy for priority zone
  useEffect(() => {
    if (priorityContainerRef.current) {
      prioritySwapyRef.current = createSwapy(priorityContainerRef.current, {
        manualSwap: true,
        dropSelector: '[data-swapy-slot]'
      } as any);

      prioritySwapyRef.current.onSwap((event: SwapEvent) => {
        console.log('Priority zone swap event:', event);
        setPrioritySlotItemMap(event.newSlotItemMap.asArray);
      });
    }

    return () => {
      if (prioritySwapyRef.current) {
        prioritySwapyRef.current.destroy();
      }
    }
  }, []);

  // Update Swapy when items change
  useEffect(() => {
    if (normalSwapyRef.current) {
      utils.dynamicSwapy(normalSwapyRef.current, documents, 'id', normalSlotItemMap, setNormalSlotItemMap);
    }
  }, [documentIds]); // Use documentIds for stable dependency

  useEffect(() => {
    if (prioritySwapyRef.current) {
      utils.dynamicSwapy(prioritySwapyRef.current, priorityDocuments, 'id', prioritySlotItemMap, setPrioritySlotItemMap);
    }
  }, [priorityDocumentIds]); // Use priorityDocumentIds for stable dependency

  // Move document from normal to priority
  const moveToNormal = (docId: string) => {
    const docToMove = priorityDocuments.find(doc => doc.id === docId);
    if (!docToMove) return;
    
    const newPriorityDocs = priorityDocuments.filter(doc => doc.id !== docId);
    const newNormalDocs = [...documents, docToMove];
    
    onPriorityDocumentsChange(newPriorityDocs);
    onDocumentsChange(newNormalDocs);
  };

  // Move document from normal to priority
  const moveToPriority = (docId: string) => {
    const docToMove = documents.find(doc => doc.id === docId);
    if (!docToMove) return;
    
    const newNormalDocs = documents.filter(doc => doc.id !== docId);
    const newPriorityDocs = [...priorityDocuments, docToMove];
    
    onDocumentsChange(newNormalDocs);
    onPriorityDocumentsChange(newPriorityDocs);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, doc: DocItem, source: 'normal' | 'priority') => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      docId: doc.id,
      source
    }));
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, target: 'normal' | 'priority') => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, target: 'normal' | 'priority') => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    if (data.source === 'normal' && target === 'priority') {
      moveToPriority(data.docId);
    } else if (data.source === 'priority' && target === 'normal') {
      moveToNormal(data.docId);
    }
  };

  // Remove document from either list
  const removeDocument = (docId: string, source: 'normal' | 'priority') => {
    if (source === 'normal') {
      onDocumentsChange(documents.filter(doc => doc.id !== docId));
    } else {
      onPriorityDocumentsChange(priorityDocuments.filter(doc => doc.id !== docId));
    }
  };

  return (
    <div className="border-1 rounded-lg p-2">
      
      {/* Container for both zones side by side */}

      <div className="flex flex-row gap-4">
        {/* Priority Zone */}
        <div 
          className="flex-1"
          onDragOver={(e) => handleDragOver(e, 'priority')}
          onDrop={(e) => handleDrop(e, 'priority')}
        >
          <h3 className="text-lg font-semibold mb-2 text-primary">Priority Documents | {prioritySlottedItems.length}</h3>
          <div 
            ref={priorityContainerRef}
            className="grid grid-cols-2 gap-4 mb-4 min-h-[120px] max-h-[300px] overflow-y-auto bg-green-100 p-4 border-2 border-dashed border-green-400 rounded"
          >
            {prioritySlottedItems.map(({ slotId, item, itemId }) => {
              if (!item) return null;
              
              return (
                <div 
                  key={slotId} 
                  data-swapy-slot={slotId}
                  className="border-2 border-dashed border-green-400 rounded p-2 min-h-[100px]"
                >
                  <div 
                    key={itemId} 
                    data-swapy-item={itemId}
                    className="relative cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'priority')}
                  >
                    <button 
                      onClick={() => removeDocument(item.id, 'priority')}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center z-10"
                      title="Remove document"
                    >
                        {/* X icon */}
                        <Cross2Icon className='h-2 w-2'/>
                      
                    </button>
                    <DocBlock
                      fileName={item.fileName}
                      fileType={item.fileType}
                      fileSize={item.fileSize}
                      file={item.file}
                      onSelect={() => onDocumentSelect && onDocumentSelect(item)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Normal Zone */}
        <div
          className="flex-1"
          onDragOver={(e) => handleDragOver(e, 'normal')}
          onDrop={(e) => handleDrop(e, 'normal')}
        >
          <h3 className="text-lg font-semibold mb-2">Normal Documents | {normalSlottedItems.length}</h3>
          <div 
            ref={normalContainerRef}
            className="grid grid-cols-2 gap-4 mb-4 min-h-[120px] max-h-[300px] overflow-y-auto bg-blue-200 p-4 border-2 border-dashed border-blue-500 rounded"
          >
            {normalSlottedItems.map(({ slotId, item, itemId }) => {
              if (!item) return null;
              
              return (
                <div 
                  key={slotId} 
                  data-swapy-slot={slotId}
                  className="border-2 border-dashed border-blue-500 rounded p-2 min-h-[100px]"
                >
                  <div 
                    key={itemId} 
                    data-swapy-item={itemId}
                    className="relative cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'normal')}
                  >
                    <button 
                      onClick={() => removeDocument(item.id, 'normal')}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center z-10"
                      title="Remove document"
                    >
                        {/* X icon */}
                        <Cross2Icon className='h-2 w-2'/>
                      {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg> */}
                    </button>
                    <DocBlock
                      fileName={item.fileName}
                      fileType={item.fileType}
                      fileSize={item.fileSize}
                      file={item.file}
                      onSelect={() => onDocumentSelect && onDocumentSelect(item)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};