import React from 'react';

interface DocBlockProps {
    fileName: string;
    fileType: string;
    fileSize: number; // in bytes
    file: File | null; // File object that can be fetched by the parent component
    onSelect?: () => void; // Optional callback when the document is selected
}

export const DocBlock: React.FC<DocBlockProps> = ({ fileName, fileType, fileSize, file, onSelect }) => {
    // Convert file size to appropriate unit
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Determine icon based on file type
    const getFileIcon = (): string => {
        const iconMap: {[key: string]: string} = {
            'pdf': '📄',
            'docx': '📝',
            'xlsx': '📊',
            'png': '🖼️',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'txt': '📄',
            // Add more file types as needed
        };

        // Get extension from file type or default to generic document icon
        return iconMap[fileType.toLowerCase()] || '📁';
    };

    // Check if file is available (removing the unused parameter warning)
    const isFileAvailable = file !== null;

    return (
        <div 
            className={`border border-border rounded-lg p-3 flex items-center cursor-pointer my-2 bg-card text-card-foreground hover:bg-muted transition-colors ${isFileAvailable ? 'opacity-100' : 'opacity-80'}`}
            onClick={onSelect}
        >
            <div className="text-2xl mr-3">
                {getFileIcon()}
            </div>
            <div className="flex flex-col">
                <div className="font-bold">{fileName}</div>
                <div className="text-sm text-muted-foreground">
                    {fileType.toUpperCase()} • {formatFileSize(fileSize)}
                    {!isFileAvailable && <span className="ml-2 text-yellow-600">(Not loaded)</span>}
                </div>
            </div>
        </div>
    );
};

export default DocBlock;