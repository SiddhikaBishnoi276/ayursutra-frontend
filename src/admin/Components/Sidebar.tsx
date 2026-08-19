import { 
    LayoutDashboard, 
    Users, 
    FileSpreadsheet, 
    BedDouble, 
    BarChart3, 
    Activity, 
    HelpCircle, 
    Settings, 
    ChevronLeft, 
    ChevronRight,
    Building2 
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'staff', label: 'Staff Management', icon: Users },
        { id: 'packages', label: 'Therapy Protocols', icon: FileSpreadsheet },
        { id: 'rooms', label: 'Rooms & Equipment', icon: BedDouble },
        { id: 'analytics', label: 'Clinic Analytics', icon: BarChart3 },
        { id: 'oversight', label: 'System Oversight', icon: Activity },
        { id: 'questionnaire', label: 'Prakriti Questionnaire', icon: HelpCircle },
        { id: 'settings', label: 'Clinic Profile & Settings', icon: Settings },
    ];

    return (
        <aside 
            className={`sticky top-0 left-0 z-20 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
                collapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* Sidebar Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 text-amber-300">
                        <Building2 className="h-5.5 w-5.5" />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-800 tracking-tight text-base leading-none">AyurSutra</span>
                            <span className="text-[10px] font-bold text-amber-800 tracking-wider uppercase mt-1">Admin Panel</span>
                        </div>
                    )}
                </div>

                {/* Collapsible toggle button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-650 transition absolute -right-3 top-5"
                >
                    {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 flex flex-col gap-1.5 p-3 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3.5 w-full rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                                isActive 
                                    ? 'bg-emerald-900 text-white shadow-sm shadow-emerald-900/10' 
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                            }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            {!collapsed && (
                                <span className="truncate tracking-wide">{item.label}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs uppercase border border-slate-250">
                        OP
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-850 truncate leading-tight">Ops Director</span>
                            <span className="text-[10px] text-slate-400 truncate">ops@ayursutra.com</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};
