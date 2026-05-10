import AuthLayout from "../layouts/AuthLayout";

const Signup = () => {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start discovering AI-matched opportunities today."
    >

      <form className="space-y-6">

        {/* Name */}
        <div>
          <label className="block text-sm mb-2 text-slate-300">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
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
            placeholder="Create password"
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

        {/* Signup Button */}
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
          Create Account
        </button>

      </form>

    </AuthLayout>
  );
};

export default Signup;