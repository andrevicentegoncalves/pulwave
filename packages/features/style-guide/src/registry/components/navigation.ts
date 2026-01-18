/**
 * Navigation Registry
 * Components for wayfinding and hierarchy
 */
import type { ComponentRegistry } from '../types';
import * as NavigationContent from '../../content/components/navigation';

export const navigationRegistry: ComponentRegistry = {
    'components/navigation/breadcrumbs': {
        doc: NavigationContent.BreadcrumbsDoc,
        demos: NavigationContent.BreadcrumbsDemos,
        title: 'Breadcrumbs',
    },
    'components/navigation/burger-menu': {
        doc: NavigationContent.BurgerMenuDoc,
        demos: NavigationContent.BurgerMenuDemos,
        title: 'BurgerMenu',
    },
    'components/navigation/menu': {
        doc: NavigationContent.MenuDoc,
        demos: NavigationContent.MenuDemos,
        title: 'Menu',
    },
    'components/navigation/mobile-header': {
        doc: NavigationContent.MobileHeaderDoc,
        demos: NavigationContent.MobileHeaderDemos,
        title: 'MobileHeader',
    },
    'components/navigation/nested-sidebar': {
        doc: NavigationContent.NestedSidebarDoc,
        demos: NavigationContent.NestedSidebarDemos,
        title: 'NestedSidebar',
    },
    'components/navigation/pagination': {
        doc: NavigationContent.PaginationDoc,
        demos: NavigationContent.PaginationDemos,
        title: 'Pagination',
    },
    'components/navigation/stepper': {
        doc: NavigationContent.StepperDoc,
        demos: NavigationContent.StepperDemos,
        title: 'Stepper',
    },
    'components/navigation/tabs': {
        doc: NavigationContent.TabsDoc,
        demos: NavigationContent.TabsDemos,
        title: 'Tabs',
    },
    'components/navigation/sidebar-section': {
        doc: NavigationContent.SidebarSectionDoc,
        demos: NavigationContent.SidebarSectionDemos,
        title: 'SidebarSection',
    },
};
