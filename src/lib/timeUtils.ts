export interface TimeBlock {
  time: string;
  task: string;
  emoji: string;
  type: 'gym' | 'study' | 'college' | 'break' | 'routine';
}

/**
 * Get current date in user's local timezone as YYYY-MM-DD string
 * This fixes the UTC timezone bug that was causing wrong dates
 */
export function getLocalDateString(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current date and time in user's local timezone as ISO string
 * This preserves the timezone information unlike toISOString()
 */
export function getLocalDateTimeString(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Get a date object for the start of today in user's local timezone
 */
export function getLocalDateStart(date?: Date): Date {
  const d = date || new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Get a date object for the end of today in user's local timezone
 */
export function getLocalDateEnd(date?: Date): Date {
  const d = date || new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/**
 * Check if two dates are the same day in local timezone
 */
export function isSameLocalDay(date1: Date, date2: Date): boolean {
  return getLocalDateString(date1) === getLocalDateString(date2);
}

/**
 * Get date string for a specific number of days ago
 */
export function getLocalDateStringDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return getLocalDateString(date);
}

export const weekdaySchedule: TimeBlock[] = [
  { time: '6:00', task: 'Wake + Water + Prayer', emoji: '🌅', type: 'routine' },
  { time: '6:15', task: 'Gym Time - Push/Pull/Legs', emoji: '🏋️', type: 'gym' },
  { time: '7:15', task: 'Breakfast + Protein', emoji: '🥣', type: 'routine' },
  { time: '8:30', task: 'College', emoji: '🎓', type: 'college' },
  { time: '16:30', task: 'College', emoji: '🎓', type: 'college' },
  { time: '17:00', task: 'Nap/Reset', emoji: '😴', type: 'break' },
  { time: '17:30', task: 'TUF DSA Concept Video', emoji: '📚', type: 'study' },
  { time: '18:15', task: 'Striver Sheet (2-3 Questions)', emoji: '💻', type: 'study' },
  { time: '19:15', task: 'Dinner', emoji: '🍽️', type: 'routine' },
  { time: '20:00', task: 'DSA Revision OR Dev (Light)', emoji: '⚡', type: 'study' },
  { time: '21:00', task: 'Wind Down: Video or Reflect', emoji: '🧘', type: 'break' },
  { time: '22:15', task: 'Prayer + Prep Next Day', emoji: '🙏', type: 'routine' },
  { time: '22:30', task: 'Sleep', emoji: '😴', type: 'routine' },
];

export const weekendSchedule = {
  saturday: [
    { time: '9:00', task: 'DSA Mock Contest', emoji: '⚔️', type: 'study' },
    { time: '10:00', task: 'Cohort 3.0 Project Build', emoji: '🛠️', type: 'study' },
    { time: '14:00', task: 'Push + Polish + Host', emoji: '🚀', type: 'study' },
    { time: '16:00', task: 'Rest/Social', emoji: '😊', type: 'break' },
    { time: '18:00', task: 'DSA Revise', emoji: '📖', type: 'study' },
    { time: '20:00', task: 'System Design Video', emoji: '🏗️', type: 'study' },
  ] as TimeBlock[],
  sunday: [
    { time: '9:00', task: 'Striver Sheet Weekly Review', emoji: '📊', type: 'study' },
    { time: '11:00', task: 'Resume/GitHub/LinkedIn Updates', emoji: '📝', type: 'study' },
    { time: '14:00', task: 'Read/Reflect', emoji: '📚', type: 'break' },
    { time: '17:00', task: 'Weekly Plan Reset', emoji: '🔄', type: 'routine' },
  ] as TimeBlock[],
};

export function getCurrentTimeBlock(): TimeBlock | null {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute; // Convert to minutes since midnight
  
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  let schedule: TimeBlock[];
  
  if (isWeekend) {
    schedule = now.getDay() === 6 ? weekendSchedule.saturday : weekendSchedule.sunday;
  } else {
    schedule = weekdaySchedule;
  }
  
  // Find the current time block
  for (let i = 0; i < schedule.length; i++) {
    const [hour, minute] = schedule[i].time.split(':').map(Number);
    const blockTime = hour * 60 + minute;
    
    // If it's the last block or current time is before next block
    if (i === schedule.length - 1 || currentTime < blockTime) {
      return schedule[i];
    }
    
    // Check if current time falls within this block
    if (i < schedule.length - 1) {
      const [nextHour, nextMinute] = schedule[i + 1].time.split(':').map(Number);
      const nextBlockTime = nextHour * 60 + nextMinute;
      
      if (currentTime >= blockTime && currentTime < nextBlockTime) {
        return schedule[i];
      }
    }
  }
  
  return schedule[0]; // Default to first block
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function isCurrentTimeBlock(timeBlock: TimeBlock): boolean {
  const current = getCurrentTimeBlock();
  return current?.time === timeBlock.time && current?.task === timeBlock.task;
}
