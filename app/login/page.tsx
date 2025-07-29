"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleEmailVerification(code);
    }
  }, [searchParams]);

  const handleEmailVerification = async (code: string) => {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      toast.success("Email verified successfully! Welcome!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      toast.error("Email verification failed");
    }
  };

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      toast.error("Login failed: " + error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Login successful! Welcome back!");

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };
  const handleSignup = async (formData: FormData) => {
    setIsSignup(true);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
      toast.error("Signup failed: " + error.message);
      setIsSignup(false);
      return;
    }

    toast.success(
      "Account created! Please check your email to verify your account."
    );
    setIsSignup(false);
  };
  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex">
          {/* Left side - Movie background (hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/2 relative">
            <div
              className="w-full bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1489599843714-2e99ac2108c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-900 px-6 py-12">
            <div className="w-full max-w-md space-y-8">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
                      <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    Movie Explorer
                  </span>
                </div>
              </div>

              {/* Sign In Form */}
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

                <form className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Email"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Password"
                    />
                  </div>

                  {/* Remember me and Forgot password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 text-orange-500"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 text-sm text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm text-orange-400 hover:text-orange-300"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Sign In Button */}
                  <button
                    formAction={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-800 text-gray-400">
                        or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    type="button"
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                  {/* Sign up link */}
                  <div className="mt-6 text-center">
                    <span className="text-gray-400">
                      Don't have an account?{" "}
                    </span>
                    <button
                      formAction={handleSignup}
                      disabled={isSignup}
                      className="w-full bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white disabled:opacity-50 font-semibold py-3 px-4 rounded-lg transition duration-200"
                    >
                      {isSignup ? "Creating account..." : "Create new account"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
