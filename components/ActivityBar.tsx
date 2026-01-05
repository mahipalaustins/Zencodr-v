import { Files, Search, Settings, User } from 'lucide-react';
import { useUser } from './providers/UserProvider';

export default function ActivityBar() {
    const user = useUser();

    return (
        <div className="w-14 h-full bg-gradient-to-b from-navy-900 to-navy-800 flex flex-col items-center py-3 justify-between border-r border-white/10 relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-subtle opacity-50 pointer-events-none"></div>

            <div className="flex flex-col gap-1 w-full relative z-10">
                <ActivityItem icon={<Files size={22} />} active label="Explorer" />
                <ActivityItem icon={<Search size={22} />} label="Search" />
            </div>

            <div className="flex flex-col gap-3 mb-2 w-full items-center relative z-10">
                <ActivityItem icon={<User size={22} />} label="Account" />
                <ActivityItem icon={<Settings size={22} />} label="Settings" />
            </div>
        </div>
    );
}

function ActivityItem({ icon, active, label }: { icon: React.ReactNode, active?: boolean, label: string }) {
    return (
        <div
            className={`
                w-full h-12 flex items-center justify-center cursor-pointer relative group
                transition-all duration-200
                ${active ? 'text-cyan' : 'text-gray-400 hover:text-cyan'}
            `}
            title={label}
        >
            {active && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-primary rounded-r-full"></div>
            )}
            <div className={`
                transition-all duration-200
                ${active ? 'scale-110 drop-shadow-glow' : 'group-hover:scale-110 group-hover:drop-shadow-glow-sm'}
            `}>
                {icon}
            </div>
        </div>
    );
}
