import React, { useRef } from 'react';
import { Divider } from '../../../components/ui';
import {
  Alerts,
  Badges,
  Buttons,
  Cards,
  Dropdowns,
  Dividers,
  FormAndInputs,
  Modals
} from './component-sections';
import SearchFilterSection from './SearchFilterSection';
import DataDisplaySection from './DataDisplaySection';

export default function Components({ triggerAlert }) {
  const alertsRef = useRef(null);
  const badgesRef = useRef(null);
  const buttonsRef = useRef(null);
  const cardsRef = useRef(null);
  const dropdownsRef = useRef(null);
  const formsRef = useRef(null);
  const modalsRef = useRef(null);
  const dividersRef = useRef(null);
  const searchFilterRef = useRef(null);
  const dataDisplayRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--space-6)', position: 'relative' }}>
      {/* Sidebar Navigation */}
      <aside style={{
        position: 'sticky',
        top: 'var(--space-6)',
        height: 'fit-content',
        minWidth: '200px',
        padding: 'var(--space-4)',
        backgroundColor: 'var(--color-surface-subtle)',
        borderRadius: 'var(--border-radius-m)',
        border: '1px solid var(--color-border-default)'
      }}>
        <h4 style={{
          fontSize: 'var(--font-size-body-s)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)',
          margin: '0 0 var(--space-3) 0'
        }}>Components</h4>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {[
              { name: 'Alerts', ref: alertsRef },
              { name: 'Badges', ref: badgesRef },
              { name: 'Buttons', ref: buttonsRef },
              { name: 'Cards', ref: cardsRef },
              { name: 'Dropdowns', ref: dropdownsRef },
              { name: 'Forms & Inputs', ref: formsRef },
              { name: 'Modals', ref: modalsRef },
              { name: 'Dividers', ref: dividersRef },
              { name: 'Search & Filter', ref: searchFilterRef },
              { name: 'Data Display', ref: dataDisplayRef }
            ].map(({ name, ref }) => (
              <li key={name}>
                <button
                  onClick={() => scrollToSection(ref)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: 'var(--space-2) var(--space-3)',
                    fontSize: 'var(--font-size-caption-m)',
                    fontWeight: 'var(--font-weight-regular)',
                    color: 'var(--color-on-surface-default)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--border-radius-s)',
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast) var(--easing-standard)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-surface-hover)';
                    e.target.style.fontWeight = 'var(--font-weight-medium)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.fontWeight = 'var(--font-weight-regular)';
                  }}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="styleguide-section" style={{ flex: 1 }}>
        <div ref={alertsRef}>
          <Alerts triggerAlert={triggerAlert} />
        </div>

        <Divider style={{ margin: 'var(--space-10) 0' }} />

        <div ref={badgesRef}>
          <Badges />
        </div>

        <Divider style={{ margin: 'var(--space-10) 0' }} />

        <div ref={buttonsRef}>
          <Buttons />
        </div>

        <Divider style={{ margin: 'var(--space-10) 0' }} />

        <div ref={cardsRef}>
          <Cards />
        </div>

        <Divider style={{ margin: 'var(--space-10) 0' }} />

        <div ref={dropdownsRef}>
          <Dropdowns />
        </div>

        <Divider style={{ margin: 'var(--space-10) 0' }} />

        <div ref={formsRef}>
          <FormAndInputs />
        </div>

        <Divider style={{ margin: 'var(--space-10) 0' }} />

        <div ref={modalsRef}>
          <Modals />
        </div>

        <Divider style={{ margin: 'var(--space-10) 0' }} />

        <div ref={dividersRef}>
          <Dividers />
        </div>

        <Divider style={{ margin: 'var(--space-10) 0' }} />

        <div ref={searchFilterRef}>
          <SearchFilterSection />
        </div>

        <Divider style={{ margin: 'var(--space-10) 0' }} />

        <div ref={dataDisplayRef}>
          <DataDisplaySection />
        </div>
      </section>
    </div>
  );
}