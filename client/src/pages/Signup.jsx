import AuthLayout from "../layouts/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

const handleSignup = (e) => {

  e.preventDefault();

  const result = signup(
    name,
    email,
    password
  );

  if (!result.success) {

    alert(result.message);

    return;
  }

  navigate("/dashboard");
};
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start discovering AI-matched opportunities today."
    >

      <form className="space-y-6" onSubmit={handleSignup}>

        {/* Name */}
        <div>
          <label className="block text-sm mb-2 text-slate-300">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          type="submit"
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