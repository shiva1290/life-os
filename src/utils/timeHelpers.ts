
export const parseTimeSlot = (timeSlot: string): { start: number; end: number } | null => {
  try {
    if (!timeSlot || !timeSlot.includes('-')) return null;
    
    const [startStr, endStr] = timeSlot.split('-');
    if (!startStr || !endStr) return null;
    
    const parseTime = (timeStr: string): number => {
      const cleanTime = timeStr.trim();
      const [hours, minutes = '0'] = cleanTime.split(':');
      const h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);
      
      if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
        throw new Error('Invalid time format');
      }
      
      return h * 60 + m;
    };
    
    const start = parseTime(startStr);
    const end = parseTime(endStr);
    
    return { start, end };
  } catch (error) {
    console.error('Error parsing time slot:', timeSlot, error);
    return null;
  }
};

export const getCurrentTimeInMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const isTimeInRange = (currentMinutes: number, start: number, end: number): boolean => {
  // Handle overnight blocks (e.g., 23:00-01:00)
  if (end < start) {
    return currentMinutes >= start || currentMinutes < end;
  }
  return currentMinutes >= start && currentMinutes < end;
};

export const formatTimeFromMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};
