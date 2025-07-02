
import { useState } from 'react';
import { seedUserData } from '@/utils/seedData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const DataSeeder = () => {
  const [seeding, setSeeding] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSeedData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to seed data",
        variant: "destructive",
      });
      return;
    }

    setSeeding(true);
    try {
      const result = await seedUserData(user.id);
      if (result.success) {
        toast({
          title: "Success!",
          description: "Sample data has been added to your account",
        });
      } else {
        throw new Error('Seeding failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleSeedData}
        disabled={seeding}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50"
      >
        {seeding ? 'Adding Sample Data...' : 'Add Sample Data'}
      </button>
    </div>
  );
};

export default DataSeeder;
