import { GitBranch, Wifi, Bell, WifiOff } from 'lucide-react';
import { useYjs } from './providers/YjsProvider';

export default function StatusBar() {
    const { connected } = useYjs();

    return (
        <div className="h-7 w-full bg-gradient-primary text-white flex items-center justify-between px-3 text-[11px] font-medium select-none z-50 shadow-lg">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-all">
                    <GitBranch size={13} />
                    <span className="font-semibold">main*</span>
                </div>
                <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-all">
                    <span className="bg-white/20 rounded-full w-2 h-2 border border-white/40 flex items-center justify-center text-[8px]"></span>
                    <span className="flex items-center gap-1">
                        <span className="rotate-180 text-xs">△</span>
                        <span>0</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-all">
                    <span>Ln 10, Col 45</span>
                </div>
                <div className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-all">
                    <span>UTF-8</span>
                </div>
                <div className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-all">
                    <span className="font-medium">TypeScript React</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-all ${connected ? 'text-green-400 hover:bg-white/10' : 'text-red-400 hover:bg-red-500/20'}`}>
                    {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
                    <span className="font-semibold">{connected ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className="hover:bg-white/10 p-1 rounded cursor-pointer transition-all">
                    <Bell size={13} />
                </div>
            </div>
        </div>
    );
}
