
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { seedOperatorData } from '@/utils/seedData';

const DataSeeder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Only show for the specific user
  if (!user || user.email !== 'shivaguptaj26@gmail.com') {
    return null;
  }

  const handleSeedData = async () => {
    if (!user) return;

    try {
      await seedOperatorData(user.id);
      
      toast({
        title: "Success!",
        description: "Operator system data has been populated",
      });
      
      // Refresh the page to show new data
      window.location.reload();
    } catch (error) {
      console.error('Error seeding data:', error);
      toast({
        title: "Error",
        description: "Failed to populate data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleSeedData}
        className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
      >
        🚀 Initialize Operator System
      </Button>
    </div>
  );
};

export default DataSeeder;
