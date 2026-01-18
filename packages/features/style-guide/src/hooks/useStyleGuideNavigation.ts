import { useState, useEffect, useCallback, useMemo } from 'react';

export interface StyleGuideNavigation {
    activeSection: string;
    activeCategory: string;
    activeItem: string;
}

export function useStyleGuideNavigation(navigationData: any[]) {
    const [activeSection, setActiveSection] = useState('getting-started');
    const [activeCategory, setActiveCategory] = useState('');
    const [activeItem, setActiveItem] = useState('');

    const handleSelect = useCallback((itemId: string, categoryId: string, sectionId: string) => {
        setActiveSection(sectionId);
        setActiveCategory(categoryId);
        setActiveItem(itemId);
        window.location.hash = `#/${sectionId}/${categoryId}/${itemId}`;
    }, []);

    const handleMobileSectionChange = useCallback((sectionId: string) => {
        setActiveSection(sectionId);
        const section = navigationData.find(s => s.id === sectionId);
        if (section?.categories?.[0]) {
            const firstCategory = section.categories[0];
            const firstItem = firstCategory.items?.[0] || 'overview';
            setActiveCategory(firstCategory.id);
            setActiveItem(firstItem);
            window.location.hash = `#/${sectionId}/${firstCategory.id}/${firstItem}`;
        }
    }, [navigationData]);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(2);
            if (hash) {
                const parts = hash.split('/');
                if (parts.length >= 3) {
                    const [sec, cat, item] = parts;
                    setActiveSection(sec);
                    setActiveCategory(cat);
                    setActiveItem(item);
                }
            } else {
                setActiveSection('getting-started');
                setActiveCategory('introduction');
                setActiveItem('overview');
                window.location.hash = '#/getting-started/introduction/overview';
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Listen for internal navigation events
    useEffect(() => {
        const handleNavigate = (e: CustomEvent<{ path: string }>) => {
            const path = e.detail.path;
            if (path) {
                const parts = path.split('/');
                if (parts.length >= 3) {
                    const [sec, cat, item] = parts;
                    setActiveSection(sec);
                    setActiveCategory(cat);
                    setActiveItem(item);
                    window.location.hash = `#/${path}`;
                } else if (parts.length === 2) {
                    setActiveSection(parts[0]);
                    setActiveCategory(parts[0]);
                    setActiveItem(parts[1]);
                    window.location.hash = `#/${parts[0]}/${parts[0]}/${parts[1]}`;
                }
            }
        };

        window.addEventListener('style-guide-navigate', handleNavigate as EventListener);
        return () => window.removeEventListener('style-guide-navigate', handleNavigate as EventListener);
    }, []);

    return {
        activeSection,
        activeCategory,
        activeItem,
        handleSelect,
        handleMobileSectionChange
    };
}
