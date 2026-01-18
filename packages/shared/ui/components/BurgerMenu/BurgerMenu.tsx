/**
 * BurgerMenu
 * 
 * Animated hamburger menu button for mobile navigation.
 * Transforms into an X when active.
 * 
 * @package @ui
 */
import { cn } from '@pulwave/utils';
import { burgerMenuVariants, burgerMenuLineVariants, type BurgerMenuProps } from './types';
import './styles/_index.scss';

/**
 * BurgerMenu - Mobile navigation toggle
 */
export const BurgerMenu = ({ isOpen, onClick, className, ...props }: BurgerMenuProps) => {
    return (
        <button
            className={cn(burgerMenuVariants({ isOpen }), className)}
            onClick={onClick}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            type="button"
            {...props}
        >
            <span className={cn(burgerMenuLineVariants({ position: 'top' }))}></span>
            <span className={cn(burgerMenuLineVariants({ position: 'middle' }))}></span>
            <span className={cn(burgerMenuLineVariants({ position: 'bottom' }))}></span>
        </button>
    );
};

BurgerMenu.displayName = 'BurgerMenu';

export default BurgerMenu;
