import { supabase } from '@/integrations/supabase/client';

const ADMIN_EMAIL = 'shiva103gupta@gmail.com';

export class DataCleanup {
  
  /**
   * Check if current user is admin
   */
  static async isAdminUser(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.email === ADMIN_EMAIL;
    } catch {
      return false;
    }
  }
  
  /**
   * Clear all localStorage data immediately
   * This removes data for ALL users on this browser
   * ADMIN ONLY
   */
  static async clearAllLocalStorage() {
    if (!(await this.isAdminUser())) {
      console.warn('❌ Access denied: Admin privileges required');
      return;
    }
    
    console.log('🧹 Clearing all localStorage data...');
    
    // Get all keys before clearing
    const allKeys = Object.keys(localStorage);
    console.log(`Found ${allKeys.length} localStorage keys:`, allKeys);
    
    // Clear everything
    localStorage.clear();
    
    console.log('✅ localStorage cleared completely');
    
    // Clear session storage too
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared completely');
  }
  
  /**
   * Clear database data for the currently logged-in user only
   * This is safe to run as it only affects the current user
   * ADMIN ONLY for safety
   */
  static async clearCurrentUserData() {
    if (!(await this.isAdminUser())) {
      console.warn('❌ Access denied: Admin privileges required');
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('❌ No user logged in - cannot clear user data');
        return;
      }
      
      console.log(`🧹 Clearing database data for user: ${user.email}`);
      
      // Clear user-specific tables
      const tables = ['todos', 'habits', 'habit_completions', 'notes'];
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', user.id);
          
        if (error) {
          console.error(`Error clearing ${table}:`, error);
        } else {
          console.log(`✅ Cleared ${table} for user`);
        }
      }
      
      console.log('✅ User database cleanup completed');
      
    } catch (error) {
      console.error('❌ Error during database cleanup:', error);
    }
  }
  
  /**
   * Complete cleanup - both localStorage and current user's database data
   * ADMIN ONLY
   */
  static async performFullCleanup() {
    if (!(await this.isAdminUser())) {
      console.warn('❌ Access denied: Admin privileges required');
      return;
    }
    
    console.log('🚀 Starting full data cleanup...');
    
    // Clear localStorage
    await this.clearAllLocalStorage();
    
    // Clear database data for current user
    await this.clearCurrentUserData();
    
    console.log('✅ Full cleanup completed!');
  }
}

// Quick utility functions for browser console
export const clearAllLocalStorageNow = () => {
  DataCleanup.clearAllLocalStorage();
  console.log('Page will reload in 2 seconds...');
  setTimeout(() => window.location.reload(), 2000);
};

export const testDataIsolationNow = async () => {
  await DataCleanup.testDataIsolation();
};

export const verifyDataIsolationNow = async () => {
  const isIsolated = await DataCleanup.verifyCurrentUserDataIsolation();
  console.log(isIsolated ? '✅ Data is properly isolated' : '❌ Data isolation issues found');
  return isIsolated;
};

// Add to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).clearAllLocalStorageNow = clearAllLocalStorageNow;
  (window as any).testDataIsolationNow = testDataIsolationNow;
  (window as any).verifyDataIsolationNow = verifyDataIsolationNow;
} 