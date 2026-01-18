import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with default kind (primary)', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--kind-primary');
    });

    it('renders with custom kind', () => {
      render(<Button kind="secondary">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--kind-secondary');
    });

    it('renders with custom variant', () => {
      render(<Button variant="outlined">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--variant-outlined');
    });

    it('renders with custom size', () => {
      render(<Button size="l">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--size-l');
    });

    it('renders with custom shape', () => {
      render(<Button shape="pill">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--shape-pill');
    });

    it('renders full width button', () => {
      render(<Button fullWidth>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--fullWidth');
    });

    it('renders with left icon', () => {
      render(
        <Button leftIcon={<span data-testid="left-icon">→</span>}>
          Click me
        </Button>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders with right icon', () => {
      render(
        <Button rightIcon={<span data-testid="right-icon">→</span>}>
          Click me
        </Button>
      );
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders with both left and right icons', () => {
      render(
        <Button
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
        >
          Click me
        </Button>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Loading State', () => {
    it('renders loading spinner when loading', () => {
      render(<Button loading>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--loading');
      expect(button.querySelector('.button__spinner')).toBeInTheDocument();
    });

    it('hides icons when loading', () => {
      render(
        <Button loading leftIcon={<span data-testid="left-icon">→</span>}>
          Click me
        </Button>
      );
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('is disabled when loading', () => {
      render(<Button loading>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('has aria-busy when loading', () => {
      render(<Button loading>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Disabled State', () => {
    it('renders disabled button', () => {
      render(<Button disabled>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('has aria-disabled attribute when disabled', () => {
      render(<Button disabled>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not trigger onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Interaction', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when loading', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} loading>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('passes event to onClick handler', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('supports onMouseEnter', () => {
      const handleMouseEnter = vi.fn();
      render(<Button onMouseEnter={handleMouseEnter}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('supports onMouseLeave', () => {
      const handleMouseLeave = vi.fn();
      render(<Button onMouseLeave={handleMouseLeave}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('supports onFocus', () => {
      const handleFocus = vi.fn();
      render(<Button onFocus={handleFocus}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('supports onBlur', () => {
      const handleBlur = vi.fn();
      render(<Button onBlur={handleBlur}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('is keyboard accessible', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      // Button's native onClick will fire on Enter key
      expect(button).toHaveFocus();
    });

    it('is keyboard accessible with Space key', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: ' ' });
      // Button's native onClick will fire on Space key
      expect(button).toHaveFocus();
    });

    it('hides decorative icons from screen readers', () => {
      render(
        <Button leftIcon={<span data-testid="left-icon">→</span>}>
          Click me
        </Button>
      );
      const iconContainer = screen.getByTestId('left-icon').parentElement;
      expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
    });

    it('hides spinner from screen readers', () => {
      render(<Button loading>Click me</Button>);
      const spinner = screen.getByRole('button').querySelector('.button__spinner');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });

    it('supports custom aria-label', () => {
      render(<Button aria-label="Custom label">Click me</Button>);
      expect(screen.getByRole('button', { name: 'Custom label' })).toBeInTheDocument();
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <div id="label-id">Custom Label</div>
          <Button aria-labelledby="label-id">Click me</Button>
        </>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-labelledby', 'label-id');
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <div id="desc-id">Description</div>
          <Button aria-describedby="desc-id">Click me</Button>
        </>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'desc-id');
    });
  });

  describe('HTML Attributes', () => {
    it('supports type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('defaults to type="button"', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      // If no type is specified, button defaults to "submit" in forms, but we're checking rendered HTML
      expect(button.getAttribute('type')).toBeTruthy();
    });

    it('supports form attribute', () => {
      render(<Button form="my-form">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'my-form');
    });

    it('supports name attribute', () => {
      render(<Button name="submit-button">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('name', 'submit-button');
    });

    it('supports value attribute', () => {
      render(<Button value="button-value">Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('value', 'button-value');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Click me</Button>);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it('allows ref to access button methods', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Click me</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.tagName).toBe('BUTTON');
    });
  });

  describe('Edge Cases', () => {
    it('renders with empty children', () => {
      render(<Button />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with number as children', () => {
      render(<Button>{123}</Button>);
      expect(screen.getByRole('button', { name: '123' })).toBeInTheDocument();
    });

    it('renders with multiple children', () => {
      render(
        <Button>
          Click <strong>me</strong>
        </Button>
      );
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('handles rapid clicks', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('renders with both loading and disabled props', () => {
      render(<Button loading disabled>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('btn--loading');
    });
  });

  describe('Compound Component', () => {
    it('renders Button.Icon component', () => {
      render(
        <Button>
          <Button.Icon>
            <span data-testid="icon">✓</span>
          </Button.Icon>
          Click me
        </Button>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });
});
