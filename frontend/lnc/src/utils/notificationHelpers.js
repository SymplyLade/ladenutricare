// Helper functions for notifications (if needed)
export const getNotificationIcon = (type) => {
  switch (type) {
    case 'appointment':
      return '📅';
    case 'medication':
      return '💊';
    case 'payment':
      return '💰';
    case 'health_tip':
      return '💡';
    default:
      return '🔔';
  }
};