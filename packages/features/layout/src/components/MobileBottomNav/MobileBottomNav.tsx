/**
 * MobileBottomNav Component
 *
 * Mobile-only bottom navigation bar with icon tabs.
 * Icon-only design for compact mobile experience.
 *
 * @package @pulwave/pages-shell
 */
import { cn } from '@pulwave/utils';
import type { MobileBottomNavProps } from './types';

export const MobileBottomNav = ({
    items,
    activeId,
    onSelect,
    className
}: MobileBottomNavProps) => {
    return (
        <nav className={cn('mobile-shell__bottom-nav', className)} aria-label="Section navigation">
            <div className="mobile-shell__bottom-nav-tabs">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === activeId;

                    return (
                        <button
                            key={item.id}
                            className={cn(
                                'mobile-shell__bottom-nav-tab',
                                isActive && 'mobile-shell__bottom-nav-tab--active'
                            )}
                            onClick={() => onSelect(item.id)}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                            type="button"
                        >
                            <Icon size={22} aria-hidden="true" />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

MobileBottomNav.displayName = 'MobileShell.BottomNav';

export default MobileBottomNav;


