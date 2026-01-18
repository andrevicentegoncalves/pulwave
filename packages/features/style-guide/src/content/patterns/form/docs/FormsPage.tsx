/**
 * Forms Pattern Page
 * Main page showing all form pattern demos
 */
import { ContactFormDemo, LoginFormDemo, ContactFormDefaultBgDemo } from '../demos';

const FormsPage = () => {
    return (
        <div className="forms-pattern-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--scale-10)' }}>
            <section>
                <h2 style={{ marginBottom: 'var(--scale-4)' }}>Form Patterns</h2>
                <p style={{ marginBottom: 'var(--scale-8)', color: 'var(--color-text-secondary)' }}>
                    Complete form examples demonstrating best practices for layout, validation, and user experience.
                </p>
            </section>

            <LoginFormDemo />
            <ContactFormDemo />
            <ContactFormDefaultBgDemo />
        </div>
    );
};

export default FormsPage;
