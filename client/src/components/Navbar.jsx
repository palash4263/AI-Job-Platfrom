import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">

      {/* Navbar Wrapper */}
      <nav className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-5">
        {/* Glass Navbar */}
        <div
          className="
          flex items-center justify-between
          h-20
          px-6 lg:px-10
          rounded-3xl
          bg-white/[0.04]
          backdrop-blur-2xl
          border border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.35)]
          "
        >

          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 hover:scale-105 transition-all duration-300 mx-2" 
          >
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mx-2">

              <span className="text-white">
                Apply
              </span>

              <span
                className="
                text-cyan-400
                drop-shadow-[0_0_18px_rgba(34,211,238,0.9)]
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
            gap-10
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
              font-medium text-lg
              group
              "
            >
              Home

              <span
                className="
                absolute -bottom-1 left-0
                w-0 h-[2px]
                bg-cyan-400
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
              font-medium text-lg
              group
              "
            >
              Jobs

              <span
                className="
                absolute -bottom-1 left-0
                w-0 h-[2px]
                bg-cyan-400
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
              font-medium text-lg
              group
              "
            >
              Dashboard

              <span
                className="
                absolute -bottom-1 left-0
                w-0 h-[2px]
                bg-cyan-400
                transition-all duration-300
                group-hover:w-full
                "
              ></span>
            </Link>

          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-5 mr-2">

            {/* Login */}
            <Link to="/login">
              <button
                className="
                px-6 py-2.5
                rounded-xl
                border border-cyan-400/30
                bg-white/[0.03]
                text-cyan-300
                font-medium
                transition-all duration-300
                hover:border-cyan-400
                hover:bg-cyan-400/10
                hover:text-white
                hover:shadow-lg
                hover:shadow-cyan-500/20
                hover:-translate-y-0.5
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
                px-6 py-2.5
                rounded-xl
                font-bold
                text-slate-900
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
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
            p-5
            rounded-2xl
            bg-white/[0.04]
            backdrop-blur-2xl
            border border-white/10
            space-y-4
            "
          >

            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="
              block text-slate-300
              hover:text-cyan-400
              transition
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
              transition
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
              transition
              "
            >
              Dashboard
            </Link>

            <div className="flex gap-3 pt-4">

              <Link
                to="/login"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                <button
                  className="
                  w-full py-3
                  rounded-xl
                  border border-cyan-400/30
                  text-cyan-300
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
                  w-full py-3
                  rounded-xl
                  bg-gradient-to-r
                  from-cyan-400
                  to-blue-500
                  text-slate-900
                  font-bold
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