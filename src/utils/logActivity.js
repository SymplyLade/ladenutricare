export const logActivity = (type, text) => {
    const existing = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    const newActivity = {
        type,
        text,
        time: new Date().toLocaleString(),
    };
    // Keep only the last 20 activities
    const updated = [newActivity, ...existing].slice(0, 20);
    localStorage.setItem('recentActivity', JSON.stringify(updated));
};