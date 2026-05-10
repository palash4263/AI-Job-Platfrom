import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">

      {/* Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.15),transparent_40%)] pointer-events-none"></div>

      {/* FULL WIDTH NAVBAR */}
      <Navbar />

      {/* HERO CONTENT CONTAINER */}
      <div className="relative max-w-7xl mx-auto px-6">

        {/* HERO SECTION */}
        <section className="min-h-[90vh] flex flex-col justify-center pt-20">

          <div className="max-w-5xl">

            <p className="text-cyan-400 font-semibold tracking-widest uppercase mb-6">
              AI Powered Job Discovery
            </p>

            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
              Find Your
              <span className="text-cyan-400"> Dream Job </span>
              Faster With AI
            </h1>

            <p className="text-slate-400 text-xl mt-8 leading-relaxed max-w-3xl">
              Discover highly relevant jobs from LinkedIn, Naukri,
              Indeed and more using intelligent resume matching,
              ATS optimization, and AI-powered recommendations.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-6 mt-12">

              <button
                className="
                group relative overflow-hidden
                px-9 py-4
                rounded-2xl
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                text-slate-900
                font-bold
                text-lg
                transition-all duration-300
                hover:scale-105
                hover:shadow-2xl
                hover:shadow-cyan-500/40
                "
              >
                <span className="relative z-10">
                  Get Started
                </span>

                <div
                  className="
                  absolute inset-0
                  bg-white/20
                  translate-x-[-100%]
                  group-hover:translate-x-[100%]
                  transition-transform duration-700
                  "
                ></div>
              </button>

              <button
                className="
                px-9 py-4
                rounded-2xl
                border border-slate-700
                bg-white/5
                backdrop-blur-lg
                text-white
                font-semibold
                text-lg
                transition-all duration-300
                hover:border-cyan-400
                hover:bg-cyan-400/10
                hover:shadow-lg
                hover:shadow-cyan-500/10
                hover:-translate-y-1
                "
              >
                Explore Jobs
              </button>

            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-12 mt-20">

              <div>
                <h2 className="text-5xl font-extrabold text-cyan-400">
                  10K+
                </h2>
                <p className="text-slate-400 mt-2 text-lg">
                  Active Jobs
                </p>
              </div>

              <div>
                <h2 className="text-5xl font-extrabold text-cyan-400">
                  95%
                </h2>
                <p className="text-slate-400 mt-2 text-lg">
                  Match Accuracy
                </p>
              </div>

              <div>
                <h2 className="text-5xl font-extrabold text-cyan-400">
                  5+
                </h2>
                <p className="text-slate-400 mt-2 text-lg">
                  Job Platforms
                </p>
              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default Home;