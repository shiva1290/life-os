import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white flex flex-col">
      {/* Fixed background that covers full page */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-950 to-black -z-10" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10 -z-10" />
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
          <p className="text-xl text-white/70 mb-6">Oops! Page not found</p>
          <a 
            href="/" 
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            Return to Home
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
