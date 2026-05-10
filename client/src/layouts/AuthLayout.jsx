const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent"></div>

        {/* Glow */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[120px]"></div>

        <div className="relative z-10 flex flex-col justify-center px-20">

          <h1 className="text-6xl font-black leading-tight max-w-xl">
            Smart AI-Powered
            <span className="text-cyan-400"> Job Discovery </span>
            Platform
          </h1>

          <p className="text-slate-400 text-xl mt-8 leading-relaxed max-w-lg">
            Discover relevant jobs, optimize your resume,
            track applications, and accelerate your career
            using intelligent AI recommendations.
          </p>

          {/* Stats */}
          <div className="flex gap-12 mt-16">

            <div>
              <h2 className="text-4xl font-bold text-cyan-400">
                10K+
              </h2>
              <p className="text-slate-400 mt-2">
                Jobs Listed
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-cyan-400">
                95%
              </h2>
              <p className="text-slate-400 mt-2">
                Match Accuracy
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8">

        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">

            <h2 className="text-4xl font-bold">
              {title}
            </h2>

            <p className="text-slate-400 mt-3 mb-10">
              {subtitle}
            </p>

            {children}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AuthLayout;