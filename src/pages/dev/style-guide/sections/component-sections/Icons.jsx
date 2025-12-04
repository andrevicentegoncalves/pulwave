import React from 'react';
import Icon from '../../../../../components/ui/Icon';
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  InfoCircle,
  XClose,
  Spinner,
  Home,
  User,
  Settings,
  Bell,
  ChevronRight,
  ChevronLeft,
  Menu,
  Search
} from '../../../../../components/ui/iconLibrary';

export default function Icons() {
  const icons = [
    { name: 'AlertCircle', component: AlertCircle, description: 'Info/generic alert' },
    { name: 'CheckCircle', component: CheckCircle, description: 'Success indicator' },
    { name: 'AlertTriangle', component: AlertTriangle, description: 'Warning indicator' },
    { name: 'XCircle', component: XCircle, description: 'Error indicator' },
    { name: 'InfoCircle', component: InfoCircle, description: 'Information' },
    { name: 'XClose', component: XClose, description: 'Close/dismiss' },
    { name: 'Spinner', component: Spinner, description: 'Loading state' },
    { name: 'Home', component: Home, description: 'Home navigation' },
    { name: 'User', component: User, description: 'User profile' },
    { name: 'Settings', component: Settings, description: 'Settings/config' },
    { name: 'Bell', component: Bell, description: 'Notifications' },
    { name: 'ChevronRight', component: ChevronRight, description: 'Next/expand' },
    { name: 'ChevronLeft', component: ChevronLeft, description: 'Back/collapse' },
    { name: 'Menu', component: Menu, description: 'Menu/hamburger' },
    { name: 'Search', component: Search, description: 'Search' },
  ];

  const sizes = [
    { value: '2xs', label: '2XS (12px)' },
    { value: 'xs', label: 'XS (16px)' },
    { value: 's', label: 'S (20px)' },
    { value: 'm', label: 'M (24px)' },
    { value: 'l', label: 'L (32px)' },
    { value: 'xl', label: 'XL (40px)' },
    { value: '2xl', label: '2XL (48px)' },
  ];

  return (
    <div className="component-category">
      <h3 className="component-category__title">Icons</h3>
      
      {/* ICON SIZES */}
      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Icon Sizes</h4>
      <div className="component-demo" style={{ 
        display: 'flex', 
        gap: 'var(--space-4)', 
        alignItems: 'center', 
        flexWrap: 'wrap' 
      }}>
        {sizes.map(({ value, label }) => (
          <div key={value} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <Icon size={value}>
              <CheckCircle />
            </Icon>
            <span style={{ 
              fontSize: 'var(--font-size-9xs)', 
              color: 'var(--color-on-surface-subtle)'
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ICON LIBRARY */}
      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Icon Library</h4>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 'var(--space-4)'
      }}>
        {icons.map(({ name, component: IconComponent, description }) => (
          <div 
            key={name}
            className="component-demo"
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-5)'
            }}
          >
            <Icon size="xl">
              <IconComponent />
            </Icon>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: 'var(--font-size-7xs)',
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-default)',
                marginBottom: 'var(--space-1)'
              }}>
                {name}
              </div>
              <div style={{ 
                fontSize: 'var(--font-size-9xs)',
                color: 'var(--color-on-surface-subtle)'
              }}>
                {description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ICON COLORS */}
      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Icon Colors</h4>
      <p style={{ 
        fontSize: 'var(--font-size-body-s)', 
        color: 'var(--color-on-surface-subtle)',
        marginBottom: 'var(--space-4)'
      }}>
        Icons inherit currentColor from their parent element
      </p>
      <div className="component-demo" style={{ 
        display: 'flex', 
        gap: 'var(--space-4)', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ color: 'var(--color-primary)' }}>
          <Icon size="l">
            <CheckCircle />
          </Icon>
          <div style={{ fontSize: 'var(--font-size-9xs)', marginTop: 'var(--space-1)' }}>
            Primary
          </div>
        </div>
        <div style={{ color: 'var(--color-feedback-success)' }}>
          <Icon size="l">
            <CheckCircle />
          </Icon>
          <div style={{ fontSize: 'var(--font-size-9xs)', marginTop: 'var(--space-1)' }}>
            Success
          </div>
        </div>
        <div style={{ color: 'var(--color-feedback-warning)' }}>
          <Icon size="l">
            <AlertTriangle />
          </Icon>
          <div style={{ fontSize: 'var(--font-size-9xs)', marginTop: 'var(--space-1)' }}>
            Warning
          </div>
        </div>
        <div style={{ color: 'var(--color-feedback-error)' }}>
          <Icon size="l">
            <XCircle />
          </Icon>
          <div style={{ fontSize: 'var(--font-size-9xs)', marginTop: 'var(--space-1)' }}>
            Error
          </div>
        </div>
        <div style={{ color: 'var(--color-feedback-info)' }}>
          <Icon size="l">
            <InfoCircle />
          </Icon>
          <div style={{ fontSize: 'var(--font-size-9xs)', marginTop: 'var(--space-1)' }}>
            Info
          </div>
        </div>
      </div>

      {/* USAGE EXAMPLES */}
      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Usage Examples</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Inline with text */}
        <div className="component-demo">
          <p style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-2)',
            margin: 0,
            fontSize: 'var(--font-size-7xs)'
          }}>
            <Icon size="s">
              <CheckCircle />
            </Icon>
            <span>Icon inline with text</span>
          </p>
        </div>

        {/* With buttons */}
        <div className="component-demo">
          <button className="btn btn--primary" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-2)' 
          }}>
            <Icon size="s">
              <CheckCircle />
            </Icon>
            <span>Button with Icon</span>
          </button>
        </div>

        {/* Loading state */}
        <div className="component-demo">
          <button className="btn btn--primary" disabled style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-2)' 
          }}>
            <Icon size="s">
              <Spinner />
            </Icon>
            <span>Loading...</span>
          </button>
        </div>
      </div>
    </div>
  );
}
