import {
  FaBriefcase,
  FaChartLine,
  FaCog,
  FaCompass,
  FaFileAlt,
  FaHome,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", icon: FaHome, active: true },
  { label: "Job Matches", icon: FaBriefcase },
  { label: "Resume Lab", icon: FaFileAlt },
  { label: "Career Insights", icon: FaChartLine },
  { label: "Explore", icon: FaCompass },
  { label: "Settings", icon: FaCog },
];

const Sidebar = () => {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-[#07111f]/95 px-5 py-6 text-white lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400 text-lg font-black text-slate-950">
          AK
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight">ApplyKing</h1>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Career OS
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                item.active
                  ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/30"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
              type="button"
            >
              <Icon className="text-base" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-sm font-bold text-white">Profile readiness</p>
        <div className="mt-4 h-2 rounded-full bg-slate-800">
          <div className="h-full w-[82%] rounded-full bg-emerald-400" />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-400">
          Add two recent projects to improve recruiter matching.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
