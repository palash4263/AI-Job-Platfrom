import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-4">

      {/* Navbar Wrapper */}
      <nav className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-6">
        {/* Glass Navbar */}
        <div
          className="
          flex items-center justify-between
          h-24
          px-8 lg:px-12
          rounded-2xl
          bg-gradient-to-r from-white/[0.08] to-white/[0.04]
          backdrop-blur-xl
          border border-white/[15]
          shadow-[0_8px_32px_rgba(0,0,0,0.2)]
          hover:shadow-[0_12px_48px_rgba(34,211,238,0.15)]
          transition-all duration-300
          "
        >

          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 hover:scale-105 transition-all duration-300 px-4 py-3" 
          >
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">

              <span className="text-white">
                Apply
              </span>

              <span
                className="
                text-cyan-400
                drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]
                "
              >
                King
              </span>

            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="
            hidden md:flex
            items-center
            gap-12
            absolute left-1/2
            -translate-x-1/2
            "
          >

            <Link
              to="/"
              className="
              relative text-slate-300
              hover:text-cyan-400
              transition-all duration-300
              font-semibold text-base
              group
              px-3 py-2
              "
            >
              Home

              <span
                className="
                absolute -bottom-1 left-0
                w-0 h-[2.5px]
                bg-gradient-to-r from-cyan-400 to-blue-500
                transition-all duration-300
                group-hover:w-full
                "
              ></span>
            </Link>

            <Link
              to="/jobs"
              className="
              relative text-slate-300
              hover:text-cyan-400
              transition-all duration-300
              font-semibold text-base
              group
              px-3 py-2
              "
            >
              Jobs

              <span
                className="
                absolute -bottom-1 left-0
                w-0 h-[2.5px]
                bg-gradient-to-r from-cyan-400 to-blue-500
                transition-all duration-300
                group-hover:w-full
                "
              ></span>
            </Link>

            <Link
              to="/dashboard"
              className="
              relative text-slate-300
              hover:text-cyan-400
              transition-all duration-300
              font-semibold text-base
              group
              px-3 py-2
              "
            >
              Dashboard

              <span
                className="
                absolute -bottom-1 left-0
                w-0 h-[2.5px]
                bg-gradient-to-r from-cyan-400 to-blue-500
                transition-all duration-300
                group-hover:w-full
                "
              ></span>
            </Link>

          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4 mr-0">

            {/* Login */}
            <Link to="/login">
              <button
                className="
                px-8 py-3.5
                rounded-lg
                border border-cyan-400/40
                bg-white/[0.05]
                text-cyan-300
                font-semibold
                transition-all duration-300
                hover:border-cyan-400/80
                hover:bg-cyan-400/15
                hover:text-cyan-100
                hover:shadow-lg
                hover:shadow-cyan-500/25
                hover:-translate-y-1
                "
              >
                Login
              </button>
            </Link>

            {/* Get Started */}
            <Link to="/signup">
              <button
                className="
                relative overflow-hidden
                px-8 py-3.5
                rounded-lg
                font-bold
                text-slate-900
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                transition-all duration-300
                hover:scale-105
                hover:-translate-y-1
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
                  bg-white/25
                  translate-x-[-100%]
                  hover:translate-x-[100%]
                  transition-transform duration-700
                  "
                ></div>
              </button>
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="
            md:hidden
            text-white
            p-3
            rounded-xl
            hover:bg-white/10
            transition-all
            "
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="
            md:hidden
            mt-4
            p-6
            rounded-2xl
            bg-gradient-to-b from-white/[0.08] to-white/[0.04]
            backdrop-blur-xl
            border border-white/[15]
            shadow-lg
            space-y-4
            "
          >

            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="
              block text-slate-300
              hover:text-cyan-400
              transition-all
              py-2.5
              px-3
              rounded-lg
              hover:bg-white/5
              "
            >
              Home
            </Link>

            <Link
              to="/jobs"
              onClick={() => setIsOpen(false)}
              className="
              block text-slate-300
              hover:text-cyan-400
              transition-all
              py-2.5
              px-3
              rounded-lg
              hover:bg-white/5
              "
            >
              Jobs
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="
              block text-slate-300
              hover:text-cyan-400
              transition-all
              py-2.5
              px-3
              rounded-lg
              hover:bg-white/5
              "
            >
              Dashboard
            </Link>

            <div className="flex gap-3 pt-4 border-t border-white/10">

              <Link
                to="/login"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                <button
                  className="
                  w-full py-3.5
                  px-4
                  rounded-lg
                  border border-cyan-400/40
                  text-cyan-300
                  font-semibold
                  transition-all
                  hover:border-cyan-400/80
                  hover:bg-cyan-400/15
                  "
                >
                  Login
                </button>
              </Link>

              <Link
                to="/signup"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                <button
                  className="
                  w-full py-3.5
                  px-4
                  rounded-lg
                  bg-gradient-to-r
                  from-cyan-400
                  to-blue-500
                  text-slate-900
                  font-bold
                  transition-all
                  hover:shadow-lg
                  hover:shadow-cyan-500/30
                  "
                >
                  Get Started
                </button>
              </Link>

            </div>

          </div>
        )}

      </nav>

    </header>
  );
};

export default Navbar;