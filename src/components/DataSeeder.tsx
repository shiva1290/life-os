
import { useState } from 'react';
import { seedUserData } from '@/utils/seedData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Database } from 'lucide-react';

const DataSeeder = () => {
  const [seeding, setSeeding] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSeedData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to load your life strategy data",
        variant: "destructive",
      });
      return;
    }

    setSeeding(true);
    try {
      const result = await seedUserData(user.id);
      if (result.success) {
        toast({
          title: "🎯 Success!",
          description: "Your complete life strategy, goals, DSA plan, and fitness timeline have been loaded!",
        });
      } else {
        throw new Error('Seeding failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your strategy data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col gap-2 items-end">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Load Strategy Data</span>
          </div>
          <p className="text-white/70 text-xs mb-3">
            Load your complete 12+ LPA career plan, DSA strategy, fitness timeline, and daily system
          </p>
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {seeding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading Strategy...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Load My Life Plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSeeder;
