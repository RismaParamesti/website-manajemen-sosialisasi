import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
  
      if (data.role === "admin") navigate("/adm/dashboardAdmin");
      else if (data.role === "superadmin") navigate("/spr/dashboardSuper");
      else navigate("/user");
    } else {
      // Tambahkan logika respon yang lebih detail
      if (data.message === "Invalid password") {
        alert("Password salah, tapi akun terdaftar.");
      } else if (data.message === "User not found") {
        alert("Email tidak ditemukan.");
      } else {
        alert(data.message || "Login gagal");
      }
    }  
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Kiri - Logo & Info (disembunyikan di HP) */}
      <div className="hidden md:flex w-full md:w-1/2 bg-[#FFEFE7] flex-col justify-center items-center p-10">
        <div className="text-center">
          <div className="mb-4">
            <img
              src="/logo192.png"
              alt="Logo"
              className="w-40 h-40 mx-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-semibold text-[#ED2025]">
            Siaga<span className="text-[#2A3382] font-bold"> Surabaya</span>
          </h1>
          <p className="mt-2 text-[#F36621]">
            Bidang Pencegahan & Kesiapsiagaan BPDB Kota Surabaya
          </p>
        </div>
      </div>

      {/* Kanan - Form Login */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-[#FFEFE7] text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-[#FFEFE7] text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right mt-1">
              <a
                href="/forgot-password"
                className="text-sm text-[#2A3382] hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            className="w-full py-2 rounded-md text-white"
            style={{ backgroundColor: "#F36621" }}
            type="submit"
          >
            Login
          </button>

          <p className="text-center text-sm">
            Don’t have an account yet?{" "}
            <span
              className="text-[#2A3382] cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
