import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from 'next/image';
import 'katex/dist/katex.min.css';
import remarkEmoji from 'remark-emoji';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import remarkSlug from 'remark-rehype';
import remarkAutolinkHeadings from 'remark-rehype';
import remarkToc from 'remark-toc';

interface ImageData {
  id: string;
  image_base64: string | null;
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
  position?: 'left' | 'center' | 'right';
}

// Define dimensions for fixed aspect ratio
interface Dimensions {
  dpi: number;
  height: number;
  width: number;
}

interface PageProps {
  index: number;
  markdown: string;
  images: ImageData[];
  dimensions: Dimensions;
}


export const Page = (content: PageProps) => {
    // Process markdown to identify image locations and references
    const processedMarkdown = content.markdown.replace(
        /!\[(.*?)\]\((.*?)\)/g, 
        (match, alt, src) => {
            // Find the corresponding image in the images array
            const imageIndex = content.images.findIndex(img => 
                img.id === src || img.id === `img-${src}.jpeg` || img.id === alt
            );
            
            if (imageIndex >= 0) {
                // Add a custom marker to identify this image by index
                return `!image-ref-${imageIndex}!`;
            }
            return match;
        }
    );

    // Enhance math formula rendering by adding proper delimiters if needed
    const enhancedMarkdown = processedMarkdown.replace(
        /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g,
        (match) => {
            // Check if this is already a block equation ($$...$$) or inline equation ($...$)
            if (match.startsWith('$$') && match.endsWith('$$')) {
                // Ensure block equations are on their own lines
                return `\n\n${match}\n\n`;
            } else if (match.startsWith('$') && match.endsWith('$')) {
                // Leave inline equations as they are
                return match;
            }
            return match;
        }
    );

    // Split markdown by image markers to separate text and images
    const segments = enhancedMarkdown.split(/(!image-ref-\d+!)/);
    
    // Create base64 image URL or use default fallback
    const getImageUrl = (imageData: ImageData) => {
        if (imageData.image_base64) {
            return `data:image/jpeg;base64,${imageData.image_base64}`;
        }
        // Fallback to a placeholder if no base64 data
        return `https://placehold.co/600x400?text=Image+${imageData.id}`;
    };

    // Render each segment - either markdown text or an image
    const renderContent = () => {
        return segments.map((segment, idx) => {
            // Check if this segment is an image reference
            const imageMatch = segment.match(/!image-ref-(\d+)!/);
            
            if (imageMatch) {
                const imageIndex = parseInt(imageMatch[1], 10);
                const imageData = content.images[imageIndex];
                
                if (imageData) {
                    const imageUrl = getImageUrl(imageData);
                    const width = imageData.width || 600;
                    const height = imageData.height || 400;
                    const position = imageData.position || 'center';
                    
                    // Apply different positioning based on metadata
                    const positionClass = {
                        'left': 'justify-start',
                        'center': 'justify-center',
                        'right': 'justify-end'
                    }[position];

                    return (
                        <div key={`image-${idx}`} className={`my-6 flex ${positionClass} w-full`}>
                            <div className="relative">
                                <div className="overflow-hidden rounded-md border border-gray-200">
                                    <Image 
                                        src={imageUrl}
                                        alt={imageData.alt || `Figure ${imageIndex + 1}`}
                                        width={width}
                                        height={height}
                                        className="object-contain"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500 text-center">
                                    {imageData.alt || `Figure ${imageIndex + 1}`}
                                </p>
                            </div>
                        </div>
                    );
                }
                
                return null;
            }
            
            // Render text segment using ReactMarkdown
            return segment ? (
              <div key={`text-${idx}`} className="my-4">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
                  remarkPlugins={[
                    remarkGfm,
                    remarkMath,
                    remarkEmoji,
                    remarkBreaks,
                    remarkSlug,
                    remarkAutolinkHeadings,
                    remarkToc
                  ]}
                  components={{
                    h1: ({ node, ...props }: any) => <h1 className="text-3xl font-bold my-6 border-b pb-2" {...props} />,
                    h2: ({ node, ...props }: any) => <h2 className="text-2xl font-bold my-5" {...props} />,
                    h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold my-4" {...props} />,
                    h4: ({ node, ...props }: any) => <h4 className="text-lg font-semibold my-3" {...props} />,
                    p: ({ node, ...props }: any) => <p className="my-3 leading-relaxed" {...props} />,
                    ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 my-3" {...props} />,
                    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 my-3" {...props} />,
                    blockquote: ({ node, ...props }: any) => (
                      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 bg-gray-50 p-2 rounded" {...props} />
                    ),
                    table: ({ node, ...props }: any) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full divide-y divide-gray-200 border" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }: any) => (
                      <th className="px-4 py-2 bg-gray-50 text-left font-medium text-gray-500" {...props} />
                    ),
                    td: ({ node, ...props }: any) => (
                      <td className="px-4 py-2 whitespace-nowrap" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isEquation = !inline && String(children).startsWith('$$') && String(children).endsWith('$$');
                      if (isEquation) {
                        return (
                          <div className="my-4 py-2 px-4 bg-gray-50 rounded-md overflow-x-auto">
                            <code className={`text-center block ${className || ''}`} {...props}>
                              {children}
                            </code>
                          </div>
                        );
                      }
                      return !inline && match ? (
                        <div className="my-2 overflow-x-auto">
                          <code className={`block p-3 rounded-md bg-gray-50 ${className || ''}`} {...props}>
                            {children}
                          </code>
                        </div>
                      ) : (
                        <code className={`bg-gray-100 rounded px-1 py-0.5 ${className || ''}`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // Custom equation renderer for math blocks using $ and $$ syntax
                    mpath: ({ value }: any) => (
                        <div className="my-4 py-2 px-4 bg-gray-50 rounded-md flex justify-center">
                            <div className="katex-display">{value}</div>
                        </div>
                    ),
                  }}
                >
                  {segment}
                </ReactMarkdown>
              </div>
            ) : null;
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto my-6 overflow-hidden shadow-lg">
            <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="prose max-w-none notion">
                    {renderContent()}
                </div>
            </CardContent>
            <CardFooter className="px-6 py-3 bg-gray-50 border-t flex justify-between">
                <span className="text-sm text-gray-600">Page {content.index}</span>
                <span className="text-sm text-gray-600">{content.images.length} images</span>
            </CardFooter>
        </Card>
    );
};

export type { PageProps, ImageData };