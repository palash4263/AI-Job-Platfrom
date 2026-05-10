import { FaBell, FaSearch } from "react-icons/fa";

const Topbar = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#06101e]/90 px-5 py-4 backdrop-blur-xl sm:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-300">
            Friday, May 8
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Dashboard
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 sm:w-80"
              placeholder="Search roles, companies, skills"
              type="text"
            />
          </label>

          <button
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-emerald-300/50 hover:text-white"
            type="button"
          >
            <FaBell />
          </button>

          <div className="flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-sky-400 text-sm font-black text-slate-950">
              C
            </div>
            <div className="hidden pr-1 sm:block">
              <p className="text-sm font-bold text-white">Candidate</p>
              <p className="text-xs text-slate-500">Open to work</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
