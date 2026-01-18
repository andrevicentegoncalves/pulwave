/**
 * Property Utilities
 * Helper functions for property logic.
 */

export const propertyUtils = {
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    },

    getDisplayName(user: any, profile: any) {
        if (!profile) return user?.email?.split('@')[0] || 'there';
        const firstName = profile.first_name || '';
        const lastName = profile.last_name || '';
        if (firstName) return firstName;
        if (lastName) return lastName;
        return user?.email?.split('@')[0] || 'there';
    }
};


