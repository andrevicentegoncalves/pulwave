import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

export const burgerMenuVariants = cva('burger-menu', {
    variants: {
        isOpen: {
            true: 'burger-menu--state-active',
            false: '',
        },
    },
    defaultVariants: {
        isOpen: false,
    },
});

export const burgerMenuLineVariants = cva('burger-menu__line', {
    variants: {
        position: {
            top: 'burger-menu__line--top',
            middle: 'burger-menu__line--middle',
            bottom: 'burger-menu__line--bottom',
        }
    }
});

export interface BurgerMenuProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof burgerMenuVariants> {
    isOpen: boolean;
}
