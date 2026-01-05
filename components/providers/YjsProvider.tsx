"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useRoom } from './RoomProvider';
import { useUser } from './UserProvider';

type YjsContextType = {
    doc: Y.Doc;
    provider: WebsocketProvider | null;
    connected: boolean;
};

const YjsContext = createContext<YjsContextType | null>(null);

export function YjsProvider({ children }: { children: React.ReactNode }) {
    const { roomId } = useRoom();
    const user = useUser();
    const [doc] = useState(() => new Y.Doc());
    const [provider, setProvider] = useState<WebsocketProvider | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!roomId || !user) return;

        // Connect to Websocket Server
        // Use env var or default to local 1234
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234';

        // Create provider
        const wsProvider = new WebsocketProvider(wsUrl, roomId, doc);

        // Awareness (Cursors, User info)
        wsProvider.awareness.setLocalStateField('user', {
            name: user.username,
            color: user.color,
        });

        wsProvider.on('status', (event: any) => {
            setConnected(event.status === 'connected');
        });

        setProvider(wsProvider);

        return () => {
            wsProvider.destroy();
        };
    }, [roomId, doc, user]);

    return (
        <YjsContext.Provider value={{ doc, provider, connected }}>
            {children}
        </YjsContext.Provider>
    );
}

export const useYjs = () => {
    const context = useContext(YjsContext);
    if (!context) throw new Error('useYjs must be used within YjsProvider');
    return context;
};
