"use client";

import React, { useState } from 'react';
import { useYjs } from './providers/YjsProvider';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Loader2 } from 'lucide-react';
import { useRoom } from './providers/RoomProvider';

export default function DownloadButton() {
    const { doc } = useYjs();
    const { room } = useRoom();
    const [zipping, setZipping] = useState(false);

    const handleDownload = async () => {
        if (!doc) return;
        setZipping(true);

        try {
            const zip = new JSZip();
            const filesMap = doc.getMap('files');

            // Helper to reconstruct paths
            // We need to build a map of id -> node first
            const nodes: Record<string, any> = {};
            filesMap.forEach((node: any) => {
                nodes[node.id] = node;
            });

            // Function to get full path
            const getPath = (id: string): string => {
                const node = nodes[id];
                if (!node) return '';
                const parentPath = node.parentId ? getPath(node.parentId) : '';
                return parentPath ? `${parentPath}/${node.name}` : node.name;
            };

            // Iterate all files
            for (const id in nodes) {
                const node = nodes[id];
                if (node.type === 'file') {
                    const path = getPath(id);
                    const yText = doc.getText(id);
                    zip.file(path, yText.toString());
                }
                // Folders are created implicitly by path in zip
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${room?.room_id || 'project'}.zip`);
        } catch (err) {
            console.error("Zip failed:", err);
            alert("Failed to zip project");
        } finally {
            setZipping(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="p-1 hover:bg-gray-700 rounded text-gray-300"
            title="Download Project"
            disabled={zipping}
        >
            {zipping ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        </button>
    );
}
