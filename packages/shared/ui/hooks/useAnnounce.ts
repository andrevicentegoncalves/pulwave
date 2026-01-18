import { useAnnounceContext } from '../components/LiveRegion';
import type { AnnouncePriority } from '../components/LiveRegion/types';

/**
 * Hook to announce messages to screen readers via LiveRegion.
 * Requires the app to be wrapped in <PulwaveProvider> or <LiveRegion>.
 */
export const useAnnounce = () => {
    const { announce } = useAnnounceContext();

    return {
        announce,
        announcePolite: (message: string) => announce(message, 'polite'),
        announceAssertive: (message: string) => announce(message, 'assertive'),
    };
};
