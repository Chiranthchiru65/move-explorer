"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const formRef = useRef<HTMLFormElement>(null);

  const TEST_CREDENTIALS = {
    email: "chiranthchiru65@gmail.com",
    password: "12345qwert",
  };

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

  const handleGuestLogin = () => {
    if (formRef.current) {
      const emailInput = formRef.current.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement;
      const passwordInput = formRef.current.querySelector(
        'input[name="password"]'
      ) as HTMLInputElement;

      if (emailInput && passwordInput) {
        emailInput.value = TEST_CREDENTIALS.email;
        passwordInput.value = TEST_CREDENTIALS.password;

        // Trigger login automatically
        const formData = new FormData();
        formData.append("email", TEST_CREDENTIALS.email);
        formData.append("password", TEST_CREDENTIALS.password);
        handleLogin(formData);
      }
    }
  };

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true);
    const data = {
      email: (formData.get("email") as string) || TEST_CREDENTIALS.email,
      password:
        (formData.get("password") as string) || TEST_CREDENTIALS.password,
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Authenticating...
            </p>
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
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-orange-500/10 p-4 rounded-full mb-6 backdrop-blur-md border border-orange-500/20">
                  <Logo size={80} />
                </div>
                <h1 className="text-5xl font-bold text-white mb-4">Streamr</h1>
                <p className="text-xl text-gray-200 max-w-md">
                  Experience the ultimate movie exploration platform with
                  blazing fast performance.
                </p>

                {/* Test Credentials for HR */}
                <div className="mt-12 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-left max-w-sm">
                  <h3 className="text-orange-400 font-semibold mb-2 flex items-center">
                    <span className="mr-2">🚀</span> Quick Demo Access
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Hiring Managers can use the following test credentials to
                    explore the dashboard immediately.
                  </p>
                  <div className="space-y-2 text-sm font-mono bg-black/30 p-3 rounded-lg border border-white/5">
                    <p className="text-gray-400">
                      <span className="text-orange-500/70">Email:</span>{" "}
                      {TEST_CREDENTIALS.email}
                    </p>
                    <p className="text-gray-400">
                      <span className="text-orange-500/70">Pass:</span>{" "}
                      {TEST_CREDENTIALS.password}
                    </p>
                  </div>
                  <button
                    onClick={handleGuestLogin}
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    Login as Guest
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-black lg:bg-gray-900 px-6 py-12">
            <div className="w-full max-w-md space-y-8">
              {/* Logo for mobile */}
              <div className="lg:hidden flex flex-col items-center mb-8">
                <Logo size={60} />
                <span className="text-3xl font-bold text-white mt-2">
                  Streamr
                </span>
              </div>

              {/* Sign In Form */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Sign In / Sign Up
                </h2>

                <form ref={formRef} className="space-y-6">
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
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Password"
                    />
                  </div>

                  {/* Sign In Button */}
                  <button
                    formAction={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-orange-500/20"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </button>

                  {/* Guest Button for mobile */}
                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    className="lg:hidden w-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold py-3 px-4 rounded-lg transition-all"
                  >
                    Login with Guest Credentials
                  </button>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest">
                      <span className="px-4 bg-[#111827] text-gray-500 font-bold">
                        New here?
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      formAction={handleSignup}
                      disabled={isSignup}
                      className="w-full bg-transparent border-2 border-orange-500/30 text-orange-500 hover:border-orange-500 hover:bg-orange-500 hover:text-white disabled:opacity-50 font-bold py-3 px-4 rounded-lg transition-all"
                    >
                      {isSignup ? "Creating account..." : "Create new account"}
                    </button>
                    <p className="mt-4 text-xs text-gray-500">
                      Signing up requires email verification.
                    </p>
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
