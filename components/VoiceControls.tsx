"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRoom } from './providers/RoomProvider';
import { useUser } from './providers/UserProvider';
import { Mic, MicOff } from 'lucide-react';
import SimplePeer from 'simple-peer';
import { SignalingMessage } from '@/lib/types';

type UserPresence = {
    id: string;
    username: string;
    color: string;
    isMuted: boolean;
    isInCall?: boolean;
    onlineAt: string;
};

export default function VoiceControls() {
    const { roomId } = useRoom();
    const user = useUser();
    const [isMuted, setIsMuted] = useState(false);
    const [isInCall, setIsInCall] = useState(false);
    const [peers, setPeers] = useState<Record<string, SimplePeer.Instance>>({});
    const peersRef = useRef<Record<string, SimplePeer.Instance>>({});
    const streamRef = useRef<MediaStream | null>(null);

    // Audio Monitoring
    const [activeSpeakers, setActiveSpeakers] = useState<Set<string>>(new Set());
    const audioContextRef = useRef<AudioContext | null>(null);
    const analysersRef = useRef<Record<string, AnalyserNode>>({});
    const animationFrameRef = useRef<number>();

    // Presence State
    const [users, setUsers] = useState<UserPresence[]>([]);
    const channelRef = useRef<any>(null);
    const signalingSubscriptionRef = useRef<any>(null);

    // Initial presence setup (always runs to see who is online/in-room)
    useEffect(() => {
        const channel = supabase.channel(`room-presence:${roomId}`, {
            config: { presence: { key: user.id } },
        });
        channelRef.current = channel;

        channel.on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState<UserPresence>();
            const all: UserPresence[] = [];
            for (const k in state) {
                if (state[k][0]) all.push(state[k][0]);
            }
            setUsers(all);
        })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await trackPresence(false); // Default: not in call
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, user.id]);

    // Handle Call Logic (Join / Leave)
    useEffect(() => {
        if (!isInCall) {
            cleanupCall();
            trackPresence(false);
            return;
        }

        const startCall = async () => {
            // 1. Audio Setup
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                streamRef.current = stream;
                stream.getAudioTracks().forEach(t => t.enabled = !isMuted);

                // Initialize AudioContext
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                if (audioContextRef.current?.state === 'suspended') {
                    await audioContextRef.current.resume();
                }

                // Monitor Local Stream
                setupAudioMonitor(stream, user.id);

                // 2. Signaling
                const sigChannel = supabase
                    .channel(`room-signaling:${roomId}`)
                    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'signaling', filter: `room_id=eq.${roomId}` }, handleSignaling)
                    .subscribe();
                signalingSubscriptionRef.current = sigChannel;

                // 3. Update Status & Announce
                await trackPresence(true);

                // Send Hello for WebRTC initiation
                await supabase.from('signaling').insert([{
                    room_id: roomId,
                    from_user: user.id,
                    data: { type: 'hello', data: {} }
                }]);

                analyzeAudioLevels();

            } catch (err) {
                console.error("Failed to join call:", err);
                setIsInCall(false);
                alert("Could not access microphone. Please allow permissions.");
            }
        };

        startCall();

        return () => {
            cleanupCall();
        };
    }, [isInCall, roomId]);

    const cleanupCall = () => {
        // Stop Tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }

        // Destroy Peers
        Object.values(peersRef.current).forEach(p => p.destroy());
        peersRef.current = {};
        setPeers({});

        // Remove Audio Elements
        document.querySelectorAll('audio').forEach(el => el.remove());

        // Stop Audio Context
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        // Cancel Animation
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Unsubscribe Signaling
        if (signalingSubscriptionRef.current) {
            supabase.removeChannel(signalingSubscriptionRef.current);
            signalingSubscriptionRef.current = null;
        }

        setActiveSpeakers(new Set());
    };

    const trackPresence = async (inCall: boolean) => {
        if (channelRef.current) {
            await channelRef.current.track({
                id: user.id,
                username: user.username,
                color: user.color,
                isMuted: isMuted,
                isInCall: inCall, // New field to show call status
                onlineAt: new Date().toISOString()
            });
        }
    };

    // Re-track when mute status changes
    useEffect(() => {
        if (isInCall) {
            trackPresence(true);
            if (streamRef.current) {
                streamRef.current.getAudioTracks().forEach(t => t.enabled = !isMuted);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMuted]);

    const setupAudioMonitor = (stream: MediaStream, userId: string) => {
        if (!audioContextRef.current) return;
        try {
            const source = audioContextRef.current.createMediaStreamSource(stream);
            const analyser = audioContextRef.current.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.5;
            source.connect(analyser);
            analysersRef.current[userId] = analyser;
        } catch (e) {
            console.error("Error setting up audio monitor", e);
        }
    };

    const analyzeAudioLevels = () => {
        if (!audioContextRef.current) return;

        const threshold = 15; // Sensitivity threshold (0-255)
        const currentSpeakers = new Set<string>();

        Object.entries(analysersRef.current).forEach(([userId, analyser]) => {
            try {
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);

                // Calculate average volume
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                }
                const average = sum / dataArray.length;

                if (average > threshold) {
                    currentSpeakers.add(userId);
                }
            } catch (e) {
                // Analyser might be disconnected
            }
        });

        setActiveSpeakers(prev => {
            // Only update if changed to avoid re-renders
            if (prev.size !== currentSpeakers.size) return currentSpeakers;
            const currentArray = Array.from(currentSpeakers);
            for (let i = 0; i < currentArray.length; i++) {
                if (!prev.has(currentArray[i])) return currentSpeakers;
            }
            return prev;
        });

        animationFrameRef.current = requestAnimationFrame(analyzeAudioLevels);
    };

    const handleSignaling = async (payload: any) => {
        if (!isInCall) return; // Ignore signals if not in call

        const msg: SignalingMessage = payload.new;
        if (msg.from_user === user.id) return;
        const { type, data } = msg.data;

        if (type === 'hello') {
            // Initiate if we are already in call and have higher ID (simple conflict res)
            // OR if new user joined, existing users initiate
            if (user.id < msg.from_user) initiatePeer(msg.from_user);
        } else if (type === 'signal') {
            if (data.target && data.target !== user.id) return;
            const remoteId = msg.from_user;
            let p = peersRef.current[remoteId];
            if (!p) {
                p = new SimplePeer({ initiator: false, trickle: false, stream: streamRef.current || undefined });
                setupPeerEvents(p, remoteId);
                peersRef.current[remoteId] = p;
            }
            p.signal(data.signal);
        }
    };

    const initiatePeer = (remoteUserId: string) => {
        if (peersRef.current[remoteUserId]) return;
        const p = new SimplePeer({ initiator: true, trickle: false, stream: streamRef.current || undefined });
        setupPeerEvents(p, remoteUserId);
        peersRef.current[remoteUserId] = p;
    };

    const setupPeerEvents = (p: SimplePeer.Instance, remoteUserId: string) => {
        p.on('signal', (d) => sendSignal('signal', { target: remoteUserId, signal: d }));
        p.on('stream', (s) => {
            addAudioElement(remoteUserId, s);
            setupAudioMonitor(s, remoteUserId);
        });
        p.on('error', (err) => {
            console.error('Peer error:', err);
        });
        p.on('close', () => {
            // Handle peer disconnect
            delete peersRef.current[remoteUserId];
            setPeers(prev => {
                const newPeers = { ...prev };
                delete newPeers[remoteUserId];
                return newPeers;
            });
        });
    };

    const sendSignal = async (type: string, payload: any) => {
        await supabase.from('signaling').insert([{
            room_id: roomId,
            from_user: user.id,
            to_user: payload?.target,
            data: { type, data: payload }
        }]);
    };

    const addAudioElement = (id: string, stream: MediaStream) => {
        const existing = document.getElementById(`audio-${id}`);
        if (existing) return;
        const audio = document.createElement('audio');
        audio.id = `audio-${id}`;
        audio.srcObject = stream;
        audio.autoplay = true;
        // Important: Ensure the audio element is playing
        audio.play().catch(e => console.error("Auto-play failed:", e));
        document.body.appendChild(audio);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleJoinLeave = () => {
        setIsInCall(!isInCall);
    };

    const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

    return (
        <div className="flex items-center gap-4 bg-[#252526] p-2 rounded-lg border border-white/10">
            {/* Call Controls */}
            <button
                onClick={handleJoinLeave}
                className={`
                    px-4 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2
                    ${isInCall
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'}
                `}
            >
                {isInCall ? 'Leave Call' : 'Join Voice'}
            </button>

            {/* Mute Toggle (Only visible in call) */}
            {isInCall && (
                <button
                    onClick={toggleMute}
                    className={`
                        p-2 rounded-full transition-all
                        ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                    `}
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
            )}

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {/* Avatars */}
            <div className="flex -space-x-2">
                {users.map(u => {
                    // Check if user is actually in the call (based on presence data)
                    // @ts-ignore
                    const userInCall = u.isInCall;
                    const isSpeaking = activeSpeakers.has(u.id) && !u.isMuted;

                    return (
                        <div key={u.id} className={`relative group transition-all duration-300 ${!userInCall ? 'opacity-50 grayscale' : ''}`}>
                            <div
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#252526]
                                    transition-all duration-150
                                    ${isSpeaking ? 'ring-2 ring-cyan shadow-[0_0_10px_rgba(0,212,255,0.5)] scale-110 z-10' : ''}
                                `}
                                style={{ background: `linear-gradient(135deg, ${u.color}, #3b82f6)` }}
                                title={`${u.username} ${userInCall ? '(In Call)' : '(Idle)'}`}
                            >
                                {getInitials(u.username)}
                            </div>

                            {/* Status Dot */}
                            {userInCall && (
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#252526] ${u.isMuted ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            )}

                            {/* Speaking Indicator Animation */}
                            {isSpeaking && (
                                <div className="absolute inset-0 rounded-full animate-ping bg-cyan opacity-20 pointer-events-none"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
