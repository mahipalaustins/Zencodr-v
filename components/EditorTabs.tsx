"use client";

import React from 'react';
import { X, FileCode } from 'lucide-react';
import { getIconColor } from '@/lib/fileUtils';

export type OpenFile = {
    id: string;
    name: string;
};

interface EditorTabsProps {
    files: OpenFile[];
    activeFileId: string | null;
    onSelect: (id: string) => void;
    onClose: (id: string, e: React.MouseEvent) => void;
}

export default function EditorTabs({ files, activeFileId, onSelect, onClose }: EditorTabsProps) {
    if (files.length === 0) return null;

    return (
        <div className="flex bg-[#1e1e1e] border-b border-gray-700 overflow-x-auto scrollbar-hide">
            {files.map(file => (
                <div
                    key={file.id}
                    onClick={() => onSelect(file.id)}
                    className={`
                group flex items-center gap-2 px-3 py-2 min-w-[120px] max-w-[200px] cursor-pointer text-sm border-r border-gray-700 select-none
                ${activeFileId === file.id ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' : 'bg-[#2d2d2d] text-gray-400 hover:bg-[#2a2d2e]'}
            `}
                >
                    <FileCode size={14} className={getIconColor(file.name)} />
                    <span className="truncate flex-1">{file.name}</span>
                    <button
                        onClick={(e) => onClose(file.id, e)}
                        className={`p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-600 ${activeFileId === file.id ? 'opacity-100' : ''}`}
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>
    );
}
