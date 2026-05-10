const JobCard = ({ job }) => {
  return (
    <div
      className="
      bg-white/[0.03]
      border border-white/10
      rounded-3xl
      p-7
      backdrop-blur-xl
      hover:border-cyan-400/20
      transition-all
      "
    >

      {/* Top */}
      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            {job.role}
          </h2>

          <p className="text-slate-400 mt-2">
            {job.company} • {job.location}
          </p>

          <p className="text-cyan-400 mt-3">
            {job.platform}
          </p>

        </div>

        {/* Match */}
        <div
          className="
          bg-cyan-500/10
          border border-cyan-400/20
          px-4 py-2
          rounded-xl
          text-cyan-300
          font-bold
          "
        >
          {job.match}%
        </div>

      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-3 mt-8">

        {job.skills.map((skill, index) => (
          <span
            key={index}
            className="
            px-4 py-2
            rounded-xl
            bg-cyan-500/10
            border border-cyan-400/10
            text-cyan-300
            text-sm
            "
          >
            {skill}
          </span>
        ))}

      </div>

      {/* Missing Skills */}
      {job.missingSkills?.length > 0 && (
        <div className="mt-6">

          <p className="text-red-400 mb-3">
            Missing Skills
          </p>

          <div className="flex flex-wrap gap-3">

            {job.missingSkills.map((skill, index) => (
              <span
                key={index}
                className="
                px-4 py-2
                rounded-xl
                bg-red-500/10
                border border-red-400/10
                text-red-300
                text-sm
                "
              >
                {skill}
              </span>
            ))}

          </div>

        </div>
      )}

      {/* Bottom */}
      <div className="flex items-center justify-between mt-8">

        <p className="text-2xl font-bold">
          {job.salary}
        </p>

        <button
          className="
          px-5 py-3
          rounded-xl
          bg-gradient-to-r
          from-cyan-400
          to-blue-500
          text-slate-900
          font-bold
          hover:scale-105
          transition-all
          "
        >
          Apply
        </button>

      </div>

    </div>
  );
};

export default JobCard;