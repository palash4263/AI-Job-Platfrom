const StatCard = ({ accent = "emerald", icon: Icon, subtitle, title, value }) => {
  const accents = {
    emerald: "bg-emerald-400/12 text-emerald-300 border-emerald-300/20",
    sky: "bg-sky-400/12 text-sky-300 border-sky-300/20",
    amber: "bg-amber-400/12 text-amber-300 border-amber-300/20",
    rose: "bg-rose-400/12 text-rose-300 border-rose-300/20",
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="mt-3 text-3xl font-black tracking-tight text-white">
            {value}
          </h3>
        </div>

        {Icon && (
          <div
            className={`grid h-11 w-11 place-items-center rounded-xl border ${
              accents[accent] || accents.emerald
            }`}
          >
            <Icon />
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-slate-500">{subtitle}</p>
    </article>
  );
};

export default StatCard;
