import { Menu as MenuUI } from '@pulwave/ui';
import './styles/_index.scss';

export interface MenuItem {
    id?: string;
    label: string;
    icon?: any;
    path?: string;
    items?: MenuItem[];
}

export interface MenuProps {
    items: MenuItem[];
    activeItem?: string;
    onItemClick: (path: string) => void;
    isCollapsed?: boolean;
}

export const Menu = (props: MenuProps) => {
    return <MenuUI {...props} />;
};

export type { MenuItem as MenuItemType, MenuProps as MenuPropsType };
