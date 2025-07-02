
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

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                LifeOS Dashboard
              </h1>
              <p className="text-xl text-white/70">
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
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-orange-400">12</div>
                  <div className="text-xs text-white/70">Day Streak</div>
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
  );
};

export default Index;
