import React from 'react';
import PropTypes from 'prop-types';

const SectionLayout = ({ sidebar, children, className = '' }) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const [sidebarStyle, setSidebarStyle] = React.useState({});
    const sidebarRef = React.useRef(null);
    const [initialTop, setInitialTop] = React.useState(null);

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    // Measure initial absolute position
    React.useEffect(() => {
        const measureTop = () => {
            if (sidebarRef.current) {
                const rect = sidebarRef.current.getBoundingClientRect();
                const calculatedTop = rect.top + window.scrollY;
                setInitialTop(calculatedTop);
            }
        };

        measureTop();
        window.addEventListener('resize', measureTop);
        return () => window.removeEventListener('resize', measureTop);
    }, []);

    // Dynamic Height Sync
    React.useEffect(() => {
        const handleScroll = () => {
            if (initialTop === null) return;

            const margin = 32; // var(--space-8) for better alignment
            const scrollY = window.scrollY;

            // The element "starts" at initialTop.
            // As we scroll, its "virtual" top relative to viewport moves up.
            // But CSS sticky catches it at 'margin'.
            const effectiveVisualTop = Math.max(margin, initialTop - scrollY);

            // Max height available in viewport
            const height = Math.max(100, window.innerHeight - effectiveVisualTop - margin);

            setSidebarStyle({
                height: `${height}px`
            });
        };

        if (initialTop !== null) {
            handleScroll(); // Update immediately
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [initialTop]);

    return (
        <div className={`section-layout ${!isExpanded ? 'section-layout--collapsed' : ''} ${className}`}>
            <div className="section-layout__sidebar" ref={sidebarRef} style={sidebarStyle}>
                {React.cloneElement(sidebar, { isExpanded, toggleSidebar, position: 'static' })}
            </div>
            <div className="section-layout__content">
                {children}
            </div>
        </div>
    );
};

SectionLayout.propTypes = {
    sidebar: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default SectionLayout;
