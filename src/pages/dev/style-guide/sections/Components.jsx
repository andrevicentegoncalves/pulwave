import React, { useRef } from 'react';
import { Divider } from '../../../../components/ui';
import {
  Alerts,
  Badges,
  Buttons,
  Cards,
  Dropdowns,
  Dividers,
  FormAndInputs,
  Modals,
  Skeletons,
  Spinners,
  Selects,
  Wizards,
  Visuals,
  Tooltips,
  DataCards,
  Tables,
  Flags,
  Icons,
  Navigation,
  TreeSelectSection
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
  const skeletonsRef = useRef(null);
  const spinnersRef = useRef(null);
  const selectsRef = useRef(null);
  const wizardsRef = useRef(null);
  const visualsRef = useRef(null);
  const tooltipsRef = useRef(null);
  const dataCardsRef = useRef(null);
  const tablesRef = useRef(null);
  const flagsRef = useRef(null);
  const iconsRef = useRef(null);
  const navigationRef = useRef(null);
  const treeSelectRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="styleguide-layout">
      {/* Sidebar Navigation */}
      <aside className="styleguide-sidebar sidebar">
        <div className="sidebar__menu" style={{ overflow: 'visible' }}>
          <h4 className="styleguide-sidebar__title">Components</h4>
          <nav className="styleguide-sidebar__nav-container">

            <div className="styleguide-sidebar__group">
              <h5 className="styleguide-sidebar__group-title">Navigation</h5>
              <div className="menu">
                {[
                  { name: 'Sidebar Section', ref: navigationRef },
                ].map(({ name, ref }) => (
                  <button key={name} onClick={() => scrollToSection(ref)} className="menu__item" role="button">
                    <span className="menu__label">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="styleguide-sidebar__group">
              <h5 className="styleguide-sidebar__group-title">Primitives</h5>
              <div className="menu">
                {[
                  { name: 'Buttons', ref: buttonsRef },
                  { name: 'Badges', ref: badgesRef },
                  { name: 'Icons', ref: iconsRef },
                  { name: 'Dividers', ref: dividersRef },
                  { name: 'Visuals', ref: visualsRef },
                  { name: 'Flags', ref: flagsRef },
                ].map(({ name, ref }) => (
                  <button key={name} onClick={() => scrollToSection(ref)} className="menu__item" role="button">
                    <span className="menu__label">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="styleguide-sidebar__group">
              <h5 className="styleguide-sidebar__group-title">Forms & Input</h5>
              <div className="menu">
                {[
                  { name: 'Forms & Inputs', ref: formsRef },
                  { name: 'Selects', ref: selectsRef },
                  { name: 'Dropdowns', ref: dropdownsRef },
                  { name: 'Tree Selects', ref: treeSelectRef },
                  { name: 'Search & Filter', ref: searchFilterRef },
                  { name: 'Wizards', ref: wizardsRef },
                ].map(({ name, ref }) => (
                  <button key={name} onClick={() => scrollToSection(ref)} className="menu__item" role="button">
                    <span className="menu__label">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="styleguide-sidebar__group">
              <h5 className="styleguide-sidebar__group-title">Data Display</h5>
              <div className="menu">
                {[
                  { name: 'Cards', ref: cardsRef },
                  { name: 'Data Cards', ref: dataCardsRef },
                  { name: 'Tables', ref: tablesRef },
                  { name: 'Data Lists', ref: dataDisplayRef },
                ].map(({ name, ref }) => (
                  <button key={name} onClick={() => scrollToSection(ref)} className="menu__item" role="button">
                    <span className="menu__label">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="styleguide-sidebar__group">
              <h5 className="styleguide-sidebar__group-title">Feedback</h5>
              <div className="menu">
                {[
                  { name: 'Alerts', ref: alertsRef },
                  { name: 'Modals', ref: modalsRef },
                  { name: 'Tooltips', ref: tooltipsRef },
                  { name: 'Spinners', ref: spinnersRef },
                  { name: 'Skeletons', ref: skeletonsRef },
                ].map(({ name, ref }) => (
                  <button key={name} onClick={() => scrollToSection(ref)} className="menu__item" role="button">
                    <span className="menu__label">{name}</span>
                  </button>
                ))}
              </div>
            </div>

          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <section className="styleguide-section styleguide-content">
        <div ref={alertsRef}><Alerts triggerAlert={triggerAlert} /></div>
        <Divider className="styleguide-divider" />

        <div ref={badgesRef}><Badges /></div>
        <Divider className="styleguide-divider" />

        <div ref={buttonsRef}><Buttons /></div>
        <Divider className="styleguide-divider" />

        <div ref={iconsRef}><Icons /></div>
        <Divider className="styleguide-divider" />

        <div ref={dividersRef}><Dividers /></div>
        <Divider className="styleguide-divider" />

        <div ref={navigationRef}><Navigation /></div>
        <Divider className="styleguide-divider" />

        <div ref={visualsRef}><Visuals /></div>
        <Divider className="styleguide-divider" />

        <div ref={flagsRef}><Flags /></div>
        <Divider className="styleguide-divider" />

        <div ref={formsRef}><FormAndInputs /></div>
        <Divider className="styleguide-divider" />

        <div ref={selectsRef}><Selects /></div>
        <Divider className="styleguide-divider" />

        <div ref={dropdownsRef}><Dropdowns /></div>
        <Divider className="styleguide-divider" />

        <div ref={treeSelectRef}><TreeSelectSection /></div>
        <Divider className="styleguide-divider" />

        <div ref={searchFilterRef}><SearchFilterSection /></div>
        <Divider className="styleguide-divider" />

        <div ref={wizardsRef}><Wizards /></div>
        <Divider className="styleguide-divider" />

        <div ref={cardsRef}><Cards /></div>
        <Divider className="styleguide-divider" />

        <div ref={dataCardsRef}><DataCards /></div>
        <Divider className="styleguide-divider" />

        <div ref={tablesRef}><Tables /></div>
        <Divider className="styleguide-divider" />

        <div ref={dataDisplayRef}><DataDisplaySection /></div>
        <Divider className="styleguide-divider" />

        <div ref={modalsRef}><Modals /></div>
        <Divider className="styleguide-divider" />

        <div ref={tooltipsRef}><Tooltips /></div>
        <Divider className="styleguide-divider" />

        <div ref={spinnersRef}><Spinners /></div>
        <Divider className="styleguide-divider" />

        <div ref={skeletonsRef}><Skeletons /></div>
      </section>
    </div>
  );
}
