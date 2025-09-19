"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const LoginPages = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // check on password and email
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter email and password",
      });
      return;
    }
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (response.error) {
        setError(response.error.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "حدث خطا ما أثناء تسجيل الدخول من فضلك حاول مره أخري لاحقا!",
        });
      }

      // set the token to the localStorage and redirect to home page
      if (response.data.session) {
        localStorage.setItem(
          "access_token",
          response.data.session.access_token
        );
        console.log(response.data.session.access_token);
        router.push("/");
      }

      setLoading(false);
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="login">
      {/* Login Form + Social Login */}
      <div className="container py-5 vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100 align-items-center">
          {/* Left Side - Form */}
          <div className="col-lg-5 col-md-6 col-12 mb-4">
            <h3 className="mb-3 fw-bold">Login</h3>

            <form onSubmit={handleLogin} className="mb-3">
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-dark w-100">
                Login
              </button>
            </form>
            {/* create an account button */}
            <div
              className="flex items-center justify-between !px-3 !py-2 translate-y-[30px] max-w-lg mx-auto"
              style={{ borderBottom: "1px solid #ccc" }}
            >
              <Link href="/" className="!text-dark">
                <IoMdArrowRoundBack size={20} />
              </Link>
              <Link
                href="/user/register"
                style={{ textDecoration: "none", fontSize: "14px" }}
                className="!text-dark"
              >
                Create an Account
              </Link>
            </div>
          </div>

          {/* Divider in middle */}
          <div className="col-lg-2 d-none d-lg-flex justify-content-center mb-3">
            <div className="d-flex flex-column align-items-center">
              <div
                style={{ width: "1px", height: "90px", background: "#ccc" }}
              ></div>
              <p className="my-2">Or</p>
              <div
                style={{ width: "1px", height: "90px", background: "#ccc" }}
              ></div>
            </div>
          </div>

          {/* Right Side - Social Login */}
          <div className="col-lg-5 col-md-6 col-12 d-flex flex-column gap-3 mt-2">
            <p className="text-center d-lg-none">Or continue with</p>
            <button className="btn btn-outline-dark d-flex align-items-center gap-2 justify-content-center">
              <FcGoogle size={22} /> Continue with Google
            </button>
            <button className="btn btn-outline-primary d-flex align-items-center gap-2 justify-content-center">
              <FaFacebook size={22} /> Continue with Facebook
            </button>
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2 justify-content-center">
              <MdEmail size={22} /> Continue with Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPages;
