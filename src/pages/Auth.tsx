import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle URL parameters
    if (mode === 'signup') {
      setIsLogin(false);
    } else if (mode === 'reset') {
      setIsForgotPassword(true);
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (!isForgotPassword && !password)) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isForgotPassword) {
        result = await resetPassword(email);
        if (result.error) {
          toast({
            title: "Reset Password Error",
            description: result.error.message || "An error occurred",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Password Reset Email Sent!",
            description: "Check your email for password reset instructions",
          });
          setIsForgotPassword(false);
          setIsLogin(true);
        }
      } else if (isLogin) {
        result = await signIn(email, password);
        if (result.error) {
          toast({
            title: "Authentication Error",
            description: result.error.message || "An error occurred",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in",
          });
          navigate('/dashboard');
        }
      } else {
        if (!fullName) {
          toast({
            title: "Error",
            description: "Please enter your full name",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        result = await signUp(email, password, fullName);
        if (result.error) {
          toast({
            title: "Authentication Error",
            description: result.error.message || "An error occurred",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex flex-col">
      {/* Fixed background that covers full page */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-950 to-black -z-10" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10 -z-10"></div>
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">LifeOS</h1>
            <p className="text-white/70">
              {isForgotPassword 
                ? 'Reset your password' 
                : isLogin 
                  ? 'Welcome back to your dashboard' 
                  : 'Create your account to get started'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isForgotPassword && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setIsLogin(true);
                }}
                className="flex items-center text-white/70 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </button>
            )}

            {!isLogin && !isForgotPassword && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm"
              />
            </div>

            {!isForgotPassword && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isForgotPassword ? 'Send Reset Email' : isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {!isForgotPassword && (
            <div className="mt-6 text-center space-y-3">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/70 hover:text-white transition-colors block"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
              
              {isLogin && (
                <button
                  onClick={() => setIsForgotPassword(true)}
                  className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                >
                  Forgot your password?
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
