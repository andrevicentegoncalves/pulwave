import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Tabs Component
 * 
 * A accessible tabs component that handles switching between different content panels.
 * Supports horizontal scrolling for headers on smaller screens.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - TabPanel components
 * @param {number} [props.defaultTab=0] - Index of the initially active tab
 * @param {function} [props.onChange] - Callback function called when tab changes
 */
export const Tabs = ({ children, defaultTab = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [hasScroll, setHasScroll] = useState(false);
  const tabs = React.Children.toArray(children);
  const headerRef = useRef(null);

  // Handle tab change
  const handleTabChange = useCallback(
    (index) => {
      setActiveTab(index);
      if (onChange) {
        onChange(index);
      }
    },
    [onChange]
  );

  // Check if tabs header has horizontal scroll
  const updateScrollState = useCallback(() => {
    if (headerRef.current) {
      setHasScroll(headerRef.current.scrollWidth > headerRef.current.clientWidth);
    }
  }, []);

  // Run on mount and window resize
  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState, tabs.length]);

  return (
    <div className="tabs">
      <div
        className={`tabs__header ${hasScroll ? 'has-scroll' : ''}`}
        role="tablist"
        ref={headerRef}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tabs__tab ${activeTab === index ? 'tabs__tab--active' : ''}`}
            onClick={() => handleTabChange(index)}
            type="button"
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      <div className="tabs__content">
        {tabs.map((tab, index) => (
          <div
            key={index}
            role="tabpanel"
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            hidden={activeTab !== index}
          >
            {activeTab === index && tab}
          </div>
        ))}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTab: PropTypes.number,
  onChange: PropTypes.func,
};

/**
 * TabPanel Component
 * 
 * Individual panel content for the Tabs component.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display in the panel
 * @param {string} props.label - Label to display in the tab header
 */
export const TabPanel = ({ children, label }) => {
  return <div className="tabs__panel">{children}</div>;
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

export default Tabs;
