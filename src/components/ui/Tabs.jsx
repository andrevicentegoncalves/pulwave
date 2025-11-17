import React, { useState, useCallback } from 'react';

export const Tabs = ({ children, defaultTab = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const tabs = React.Children.toArray(children);

  const handleTabChange = useCallback((index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  }, [onChange]);

  return (
    <div className="tabs">
      <div className="tabs__header" role="tablist">
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

export const TabPanel = ({ children }) => {
  return <div className="tabs__panel">{children}</div>;
};