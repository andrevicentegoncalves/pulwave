import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface AdminNavigation {
    activeSection: string;
    activeCategory: string;
    activeItem: string;
    handleSelect: (itemId: string, categoryId?: string, sectionId?: string) => void;
}

/**
 * Hook to manage admin navigation state for NestedMenu
 * Handles URL-based navigation and active state tracking
 */
export function useAdminNavigation(): AdminNavigation {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [activeItem, setActiveItem] = useState('');

    // Parse URL to determine active states
    useEffect(() => {
        const pathname = location.pathname;

        // Handle master-data nested routes: /admin/master-data/{itemKey}
        if (pathname.startsWith('/admin/master-data/')) {
            const itemKey = pathname.split('/admin/master-data/')[1];
            setActiveSection('/admin/master-data');
            setActiveItem(itemKey || '');

            // Determine category based on item key
            // This mapping should match the ADMIN_NAV_SECTIONS structure
            const categoryMap: Record<string, string> = {
                // Data Types
                'master_data_types': 'data-types',
                // Geography
                'countries': 'geography',
                'admin_divisions': 'geography',
                'localities': 'geography',
                'regional_blocks': 'geography',
                // Translations
                'translation_categories': 'translations',
                'translatable_tables': 'translations',
                'translatable_enums': 'translations',
                // System
                'locales': 'system',
                'timezones': 'system',
                'setting_categories': 'system',
                // Billing
                'subscription_plans': 'billing',
                'payment_icons': 'billing',
                // Roles
                'app_role': 'roles',
                'user_role': 'roles',
            };

            setActiveCategory(categoryMap[itemKey] || '');
        } else if (pathname === '/admin/master-data') {
            // On master-data root, set section active but no item
            setActiveSection('/admin/master-data');
            setActiveCategory('');
            setActiveItem('');
        } else {
            // All other admin routes are flat (no nesting)
            setActiveSection(pathname);
            setActiveCategory('');
            setActiveItem(pathname);
        }
    }, [location.pathname]);

    // Handle item selection
    const handleSelect = useCallback((itemId: string, categoryId?: string, sectionId?: string) => {
        // For flat items (top-level admin routes)
        if (itemId.startsWith('/admin/')) {
            navigate(itemId);
        } else {
            // For nested items under Master Data
            navigate(`/admin/master-data/${itemId}`);
        }
    }, [navigate]);

    return {
        activeSection,
        activeCategory,
        activeItem,
        handleSelect,
    };
}
