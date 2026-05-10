import AuthLayout from "../layouts/AuthLayout";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue your AI-powered job search journey."
    >

      <form className="space-y-6">

        {/* Email */}
        <div>
          <label className="block text-sm mb-2 text-slate-300">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="
            w-full
            bg-white/[0.03]
            border border-white/10
            rounded-xl
            px-5 py-4
            outline-none
            focus:border-cyan-400
            transition-all
            "
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-2 text-slate-300">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="
            w-full
            bg-white/[0.03]
            border border-white/10
            rounded-xl
            px-5 py-4
            outline-none
            focus:border-cyan-400
            transition-all
            "
          />
        </div>

        {/* Remember */}
        <div className="flex items-center justify-between text-sm">

          <label className="flex items-center gap-2 text-slate-400">
            <input type="checkbox" />
            Remember me
          </label>

          <button
            type="button"
            className="text-cyan-400 hover:underline"
          >
            Forgot Password?
          </button>

        </div>

        {/* Login Button */}
        <button
          className="
          w-full
          bg-gradient-to-r
          from-cyan-400
          to-blue-500
          text-slate-900
          font-bold
          py-4
          rounded-xl
          hover:scale-[1.02]
          transition-all duration-300
          shadow-lg shadow-cyan-500/20
          "
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">

          <div className="flex-1 h-px bg-white/10"></div>

          <span className="text-slate-500 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-white/10"></div>

        </div>

        {/* Google Button */}
        <button
          type="button"
          className="
          w-full
          border border-white/10
          bg-white/[0.03]
          py-4
          rounded-xl
          flex items-center justify-center gap-3
          hover:bg-white/[0.05]
          transition-all
          "
        >
          <FaGoogle />
          Continue with Google
        </button>

      </form>

    </AuthLayout>
  );
};

export default Login;