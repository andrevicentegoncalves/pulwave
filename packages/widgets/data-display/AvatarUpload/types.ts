import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

export const avatarUploadVariants = cva('avatar-upload', {
    variants: {
        size: {
            s: 'avatar-upload--s',
            default: 'avatar-upload--default',
            m: 'avatar-upload--m',
            l: 'avatar-upload--l',
            xl: 'avatar-upload--xl',
            '2xl': 'avatar-upload--2xl',
        },
        loading: {
            true: 'avatar-upload--loading',
            false: '',
        }
    },
    defaultVariants: {
        size: 'default',
        loading: false,
    },
});

export type AvatarUploadVariants = VariantProps<typeof avatarUploadVariants>;
export type AvatarUploadSize = NonNullable<AvatarUploadVariants['size']>;

export interface AvatarUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onInput' | 'onChange'>,
    VariantProps<typeof avatarUploadVariants> {
    /** Avatar image URL */
    src?: string;
    /** Alt text */
    alt?: string;
    /** Avatar size */
    size?: AvatarUploadSize;
    /** Upload handler */
    onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Loading state */
    loading?: boolean;
}
