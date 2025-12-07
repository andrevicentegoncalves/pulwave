import React, { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
  DropdownLabel
} from '../../../../../components/ui';

const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11.5 2L14 4.5L5 13.5L2 14L2.5 11L11.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCopy = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 4V2C8 1.44772 8.44772 1 9 1H13C13.5523 1 14 1.44772 14 2V10C14 10.5523 13.5523 11 13 11H11" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 4H14M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M3 4L4 13C4 13.5523 4.44772 14 5 14H11C11.5523 14 12 13.5523 12 13L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const countries = [
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
];

export default function Dropdowns() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  return (
    <div className="component-category">
      <h3 className="component-category__title">Dropdowns</h3>

      <h4 className="demo-subsection-title demo-subsection-title--first">Button Dropdowns</h4>
      <div className="demo-flex-row demo-flex-row--gap-4">
        <Dropdown trigger={<button className="btn btn--secondary">Actions</button>}>
          <DropdownLabel>Edit Options</DropdownLabel>
          <DropdownItem icon={<IconEdit />} onClick={() => alert('Edit clicked')}>
            Edit
          </DropdownItem>
          <DropdownItem icon={<IconCopy />} onClick={() => alert('Duplicate clicked')}>
            Duplicate
          </DropdownItem>
          <DropdownDivider />
          <DropdownLabel>Danger Zone</DropdownLabel>
          <DropdownItem icon={<IconTrash />} onClick={() => alert('Delete clicked')} danger>
            Delete
          </DropdownItem>
        </Dropdown>

        <Dropdown trigger={<button className="btn btn--ghost">More Options</button>}>
          <DropdownItem onClick={() => alert('Share')}>Share</DropdownItem>
          <DropdownItem onClick={() => alert('Export')}>Export</DropdownItem>
          <DropdownDivider variant="dashed" />
          <DropdownItem onClick={() => alert('Settings')}>Settings</DropdownItem>
        </Dropdown>
      </div>

      <h4 className="demo-subsection-title">Select Dropdown</h4>
      <div className="demo-max-width--300">
        <Dropdown
          trigger={
            <button className="dropdown-demo__select-trigger">
              <span className="dropdown-demo__selected-value">
                <span className="dropdown-demo__flag">{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
              </span>
              <IconChevron />
            </button>
          }
        >
          <DropdownLabel>Select Country</DropdownLabel>
          {countries.map((country) => (
            <DropdownItem
              key={country.code}
              icon={<span className="dropdown-demo__flag dropdown-demo__flag--small">{country.flag}</span>}
              onClick={() => setSelectedCountry(country)}
            >
              {country.name}
            </DropdownItem>
          ))}
        </Dropdown>
      </div>
    </div>
  );
}
