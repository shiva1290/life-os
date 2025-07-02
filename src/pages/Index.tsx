
import DailyRoutine from "@/components/DailyRoutine";
import DailyTodos from "@/components/DailyTodos";
import DSATracker from "@/components/DSATracker";
import GymCheckIn from "@/components/GymCheckIn";
import NowCard from "@/components/NowCard";
import QuickNotes from "@/components/QuickNotes";
import UserProfile from "@/components/UserProfile";
import WeeklyProgress from "@/components/WeeklyProgress";
import HabitTracker from "@/components/HabitTracker";
import DataSeeder from "@/components/DataSeeder";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="p-4 md:p-6 pb-20 md:pb-6 md:pt-20">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  LifeOS Dashboard
                </h1>
                <p className="text-xl text-slate-300">
                  Your personal productivity operating system
                </p>
              </div>
              <UserProfile />
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Top Row - Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <NowCard />
                <DSATracker />
                <GymCheckIn />
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔥</div>
                    <div className="text-2xl font-bold text-orange-400">12</div>
                    <div className="text-xs text-slate-400">Day Streak</div>
                  </div>
                </div>
              </div>

              {/* Daily Tasks */}
              <DailyTodos />

              {/* Schedule */}
              <DailyRoutine />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              <WeeklyProgress />
              <HabitTracker />
              <QuickNotes />
            </div>
          </div>
        </div>

        {/* Data Seeder Component */}
        <DataSeeder />
      </div>
    </div>
  );
};

export default Index;
