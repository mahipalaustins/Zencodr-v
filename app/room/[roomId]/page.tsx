"use client";

import { useState } from 'react';
import { RoomProvider } from '@/components/providers/RoomProvider';
import { UserProvider } from '@/components/providers/UserProvider';
import { YjsProvider } from '@/components/providers/YjsProvider';
import FileExplorer from '@/components/FileExplorer';
import CodeEditor from '@/components/CodeEditor';
import ChatPanel from '@/components/ChatPanel';
import AIAssistant from '@/components/AIAssistant';
import VoiceControls from '@/components/VoiceControls';
import EditorTabs, { OpenFile } from '@/components/EditorTabs';
import TerminalComponent from '@/components/Terminal';
import ActivityBar from '@/components/ActivityBar';
import StatusBar from '@/components/StatusBar';
import { X, Maximize2, Minimize2, MessageSquare, Bot, Share2 } from 'lucide-react';

import VoiceDebugger from '@/components/VoiceDebugger';

export default function RoomPage({ params }: { params: { roomId: string } }) {
    return (
        <UserProvider>
            <RoomProvider roomId={params.roomId}>
                <YjsProvider>
                    <RoomLayout />
                    <VoiceDebugger />
                </YjsProvider>
            </RoomProvider>
        </UserProvider>
    );
}

function RoomLayout() {
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
    const [isTerminalOpen, setIsTerminalOpen] = useState(true);
    const [activePanelTab, setActivePanelTab] = useState<'problems' | 'output' | 'debug' | 'terminal'>('terminal');
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isAIOpen, setIsAIOpen] = useState(true);
    const [problems, setProblems] = useState<any[]>([]);

    const handleSelectFile = (id: string, name: string) => {
        if (!openFiles.find(f => f.id === id)) {
            setOpenFiles([...openFiles, { id, name }]);
        }
        setActiveFileId(id);
    };

    const handleCloseTab = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFiles = openFiles.filter(f => f.id !== id);
        setOpenFiles(newFiles);
        if (activeFileId === id) {
            setActiveFileId(newFiles.length > 0 ? newFiles[newFiles.length - 1].id : null);
        }
    };

    const activeFile = openFiles.find(f => f.id === activeFileId);

    return (
        <div className="flex flex-col h-screen w-screen bg-navy-900 text-white overflow-hidden font-sans">
            {/* Main Content Area (Everything except Status Bar) */}
            <div className="flex-1 flex overflow-hidden">
                {/* 1. Activity Bar (Far Left) */}
                <ActivityBar />

                {/* 2. Side Bar (Explorer) */}
                <FileExplorer onSelectFile={handleSelectFile} />

                {/* 3. Center & Right Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-navy-900">

                    {/* Top Section: Editor + Right Panel */}
                    <div className="flex-1 flex overflow-hidden">

                        {/* Editor Group */}
                        <div className="flex-1 flex flex-col min-w-0">
                            {/* Breadcrumbs / Header area could go here, for now just Tabs */}
                            <div className="h-10 flex items-center justify-between px-4 bg-navy-800 select-none border-b border-white/10">
                                {/* Very minimal header or breadcrumbs could act here */}
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span>zencodr</span>
                                    <span>&gt;</span>
                                    <span>src</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsChatOpen(!isChatOpen)}
                                        className={`p-1.5 rounded hover:bg-[#2a2d2e] transition-colors ${isChatOpen ? 'text-blue-400' : 'text-gray-500'
                                            }`}
                                        title="Toggle Chat"
                                    >
                                        <MessageSquare size={16} />
                                    </button>
                                    <button
                                        onClick={() => setIsAIOpen(!isAIOpen)}
                                        className={`p-1.5 rounded hover:bg-[#2a2d2e] transition-colors ${isAIOpen ? 'text-purple-400' : 'text-gray-500'
                                            }`}
                                        title="Toggle AI Assistant"
                                    >
                                        <Bot size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            // Optional: visual feedback
                                            const btn = document.getElementById('share-btn');
                                            if (btn) btn.style.color = '#00d4ff';
                                            setTimeout(() => {
                                                if (btn) btn.style.color = '';
                                            }, 2000);
                                        }}
                                        id="share-btn"
                                        className="p-1.5 rounded hover:bg-[#2a2d2e] transition-colors text-gray-500 hover:text-cyan"
                                        title="Share Room Link"
                                    >
                                        <Share2 size={16} />
                                    </button>
                                    <VoiceControls />
                                </div>
                            </div>

                            <EditorTabs
                                files={openFiles}
                                activeFileId={activeFileId}
                                onSelect={(id) => setActiveFileId(id)}
                                onClose={handleCloseTab}
                            />

                            {/* Editor Content */}
                            <div className="flex-1 relative bg-navy-900">
                                <CodeEditor fileId={activeFileId} fileName={activeFile?.name} />
                            </div>
                        </div>

                        {/* Right Panel (Chat/AI Agent) - Separate toggleable sections */}
                        {(isChatOpen || isAIOpen) && (
                            <div className="w-80 border-l border-white/10 flex flex-col bg-navy-800">
                                {isChatOpen && (
                                    <div className={`flex flex-col ${isAIOpen ? 'h-1/2 border-b border-white/10' : 'flex-1'}`}>
                                        <div className="h-10 flex items-center justify-between px-3 border-b border-white/10 bg-navy-700 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-subtle opacity-30"></div>
                                            <span className="text-xs font-bold text-cyan uppercase tracking-wide relative z-10">Chat</span>
                                            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-cyan transition-colors relative z-10">
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <ChatPanel />
                                        </div>
                                    </div>
                                )}
                                {isAIOpen && (
                                    <div className={`flex flex-col ${isChatOpen ? 'h-1/2' : 'flex-1'}`}>
                                        <div className="h-10 flex items-center justify-between px-3 border-b border-white/10 bg-navy-700 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-subtle opacity-30"></div>
                                            <span className="text-xs font-bold text-purple uppercase tracking-wide relative z-10">AI Assistant</span>
                                            <button onClick={() => setIsAIOpen(false)} className="text-gray-400 hover:text-purple transition-colors relative z-10">
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <AIAssistant />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 4. Bottom Panel (Terminal) */}
                    <div className={`border-t border-white/10 bg-navy-900 flex flex-col ${isTerminalOpen ? 'h-[280px]' : 'h-6'}`}>
                        {/* Panel Tabs */}
                        <div className="flex items-center justify-between px-4 bg-navy-800 border-b border-white/10 select-none">
                            <div className="flex gap-6">
                                <PanelTab
                                    label={`PROBLEMS ${problems.length > 0 ? `(${problems.length})` : ''}`}
                                    active={activePanelTab === 'problems'}
                                    onClick={() => { setActivePanelTab('problems'); setIsTerminalOpen(true); }}
                                />
                                <PanelTab label="OUTPUT" active={activePanelTab === 'output'} onClick={() => { setActivePanelTab('output'); setIsTerminalOpen(true); }} />
                                <PanelTab label="DEBUG CONSOLE" active={activePanelTab === 'debug'} onClick={() => { setActivePanelTab('debug'); setIsTerminalOpen(true); }} />
                                <PanelTab label="TERMINAL" active={activePanelTab === 'terminal'} onClick={() => { setActivePanelTab('terminal'); setIsTerminalOpen(true); }} />
                                {/* <PanelTab label="PORTS" active={false} /> */}
                            </div>
                            <div className="flex items-center gap-2 py-1">
                                <div
                                    className="cursor-pointer hover:bg-[#333] p-1 rounded text-gray-400 hover:text-white"
                                    onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                                >
                                    {isTerminalOpen ? <X size={14} /> : <Maximize2 size={14} />}
                                </div>
                            </div>
                        </div>

                        {/* Panel Content */}
                        {isTerminalOpen && (
                            <div className="flex-1 overflow-hidden bg-navy-900 p-0 relative">
                                {activePanelTab === 'terminal' && <TerminalComponent />}
                                {activePanelTab === 'problems' && (
                                    <div className="h-full overflow-y-auto p-0">
                                        {problems.length === 0 ? (
                                            <div className="p-4 text-gray-400 text-sm font-sans">No problems have been detected in the workspace.</div>
                                        ) : (
                                            <div className="flex flex-col">
                                                {problems.map((p, i) => (
                                                    <div key={i} className="flex items-start gap-2 p-2 hover:bg-white/5 cursor-pointer border-b border-white/5 text-sm font-sans">
                                                        <div className={`mt-0.5 ${p.severity === 8 ? 'text-red-400' : 'text-yellow-400'}`}>
                                                            {p.severity === 8 ? 'ⓧ' : '⚠'}
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-gray-300">{p.message}</span>
                                                            <span className="text-gray-500 text-xs">
                                                                {activeFile?.name} [{p.startLineNumber}, {p.startColumn}]
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activePanelTab === 'output' && (
                                    <div className="p-4 text-gray-400 text-sm font-mono">
                                        [Info] Server started at http://localhost:3000<br />
                                        [Info] Ready for connections...
                                    </div>
                                )}
                                {activePanelTab === 'debug' && (
                                    <div className="p-4 text-gray-400 text-sm font-mono">Debug console not attached.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 5. Status Bar */}
            <StatusBar />
        </div>
    );
}

function PanelTab({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`
                text-[11px] font-sans py-2 border-b-[1px] cursor-pointer transition-colors
                ${active ? 'border-[#e7e7e7] text-[#e7e7e7]' : 'border-transparent text-[#969696] hover:text-[#e7e7e7]'}
            `}
        >
            {label}
        </div>
    );
}
