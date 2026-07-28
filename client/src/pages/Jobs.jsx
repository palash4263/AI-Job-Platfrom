import React from "react";
import {
  Briefcase,
  MapPin,
  Clock3,
  ArrowRight,
  Search,
} from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    location: "Remote",
    type: "Full Time",
    salary: "₹8L - ₹12L",
  },
  {
    id: 2,
    title: "React Developer",
    company: "CodeCraft",
    location: "Noida",
    type: "Internship",
    salary: "₹25K/month",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Pixel Labs",
    location: "Delhi",
    type: "Part Time",
    salary: "₹5L - ₹7L",
  },
];

function Jobs() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020617] text-white px-6 py-16">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-150px] right-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-[-200px] left-[-120px] w-[400px] h-[400px] bg-blue-500/20 blur-[140px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-16">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 mb-6">
            <Briefcase size={18} />
            Premium Career Portal
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Find Your
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Dream Career
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover futuristic opportunities in development,
            AI, design, and next-generation technology companies.
          </p>
        </div>

        {/* SEARCH */}
        <div
          className="
          relative
          max-w-5xl mx-auto
          p-5
          rounded-3xl
          border border-white/10
          bg-white/[0.04]
          backdrop-blur-2xl
          shadow-[0_8px_32px_rgba(0,0,0,0.35)]
          mb-20
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Job title or keyword"
                className="
                w-full
                bg-[#0f172a]
                border border-slate-700
                rounded-2xl
                py-4 pl-12 pr-4
                outline-none
                focus:border-cyan-400
                transition-all
                "
              />
            </div>

            <input
              type="text"
              placeholder="Location"
              className="
              bg-[#0f172a]
              border border-slate-700
              rounded-2xl
              py-4 px-4
              outline-none
              focus:border-cyan-400
              transition-all
              "
            />

            <button
              className="
              rounded-2xl
              bg-gradient-to-r
              from-cyan-400
              to-blue-500
              text-slate-900
              font-bold
              hover:scale-[1.02]
              transition-all duration-300
              shadow-xl shadow-cyan-500/20
              "
            >
              Search Jobs
            </button>

          </div>
        </div>

        {/* JOB CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {jobs.map((job) => (
            <div
              key={job.id}
              className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border border-white/10
              bg-white/[0.04]
              backdrop-blur-xl
              p-7
              hover:border-cyan-400/40
              transition-all duration-500
              hover:-translate-y-3
              hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]
              "
            >

              {/* Hover Glow */}
              <div
                className="
                absolute inset-0
                opacity-0
                group-hover:opacity-100
                transition-opacity duration-500
                bg-gradient-to-br
                from-cyan-500/10
                to-blue-500/10
                "
              ></div>

              <div className="relative z-10">

                {/* TOP */}
                <div className="flex items-center justify-between mb-8">

                  <div
                    className="
                    w-16 h-16
                    rounded-2xl
                    bg-cyan-400/10
                    border border-cyan-400/20
                    flex items-center justify-center
                    "
                  >
                    <Briefcase
                      className="text-cyan-400"
                      size={30}
                    />
                  </div>

                  <span
                    className="
                    px-4 py-1.5
                    rounded-full
                    text-sm
                    bg-cyan-400/10
                    border border-cyan-400/20
                    text-cyan-300
                    "
                  >
                    {job.type}
                  </span>

                </div>

                {/* CONTENT */}
                <h2 className="text-2xl font-bold mb-2 group-hover:text-cyan-300 transition-all">
                  {job.title}
                </h2>

                <p className="text-slate-400 mb-7">
                  {job.company}
                </p>

                <div className="space-y-4 text-slate-300">

                  <div className="flex items-center gap-3">
                    <MapPin className="text-cyan-400" size={18} />
                    <span>{job.location}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock3 className="text-cyan-400" size={18} />
                    <span>{job.salary}</span>
                  </div>

                </div>

                {/* BUTTON */}
                <button
                  className="
                  mt-10
                  w-full
                  py-4
                  rounded-2xl
                  font-semibold
                  flex items-center justify-center gap-2
                  bg-gradient-to-r
                  from-cyan-400
                  to-blue-500
                  text-slate-900
                  hover:gap-4
                  transition-all duration-300
                  "
                >
                  Apply Now
                  <ArrowRight size={18} />
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Jobs;