
interface DailyReset {
  lastReset: string;
  habits: any[];
  todos: any[];
}

export class DataService {
  private static instance: DataService;
  
  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  checkDailyReset() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('last-daily-reset');
    
    if (lastReset !== today) {
      this.performDailyReset();
      localStorage.setItem('last-daily-reset', today);
    }
  }

  private performDailyReset() {
    // Archive completed todos
    const currentTodos = JSON.parse(localStorage.getItem('daily-todos') || '[]');
    const completedTodos = currentTodos.filter((todo: any) => todo.completed);
    
    if (completedTodos.length > 0) {
      const archivedTodos = JSON.parse(localStorage.getItem('archived-todos') || '[]');
      archivedTodos.push({
        date: new Date().toDateString(),
        todos: completedTodos
      });
      localStorage.setItem('archived-todos', JSON.stringify(archivedTodos));
    }

    // Reset todos
    const resetTodos = currentTodos.map((todo: any) => ({ ...todo, completed: false }));
    localStorage.setItem('daily-todos', JSON.stringify(resetTodos));

    // Move habits to next day
    const habits = JSON.parse(localStorage.getItem('habits-editable') || '[]');
    const habitHistory = JSON.parse(localStorage.getItem('habit-history') || '{}');
    
    habits.forEach((habit: any) => {
      if (!habitHistory[habit.id]) {
        habitHistory[habit.id] = [];
      }
    });
    
    localStorage.setItem('habit-history', JSON.stringify(habitHistory));
  }

  broadcastChange(type: string, data: any) {
    window.dispatchEvent(new CustomEvent('dataChange', { 
      detail: { type, data } 
    }));
  }
}
