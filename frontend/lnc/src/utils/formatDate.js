export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const mergedOptions = { ...defaultOptions, ...options };
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, mergedOptions);
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  // Assuming timeString is in HH:MM format (24h)
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return timeString;
  }
};

export const formatDateTime = (dateString, timeString) => {
  return `${formatDate(dateString)} at ${formatTime(timeString)}`;
};