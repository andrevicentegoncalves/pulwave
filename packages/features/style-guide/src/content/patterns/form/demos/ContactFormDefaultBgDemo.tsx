/**
 * Contact Form Demo (Default Background)
 * Same as contact form but with inputs using surface-default background
 */
import React, { useState } from 'react';
import { Input, TextArea, Button, Select } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Input, TextArea, Button, Select } from '@ui';

// Override input styling via CSS to force default background and strong borders
const formStyle = {
    '--input-bg': 'var(--color-surface-default)',
    '--select-bg': 'var(--color-surface-default)',
    '--text-area-bg': 'var(--color-surface-default)'
} as React.CSSProperties;

<style>{\`
    .form-demo-default-bg .input__container,
    .form-demo-default-bg .select__trigger,
    .form-demo-default-bg .text-area__container {
        background-color: var(--color-surface-default) !important;
        // Explicitly set border width and style to ensure visibility
        border: 1px solid var(--color-border-strong) !important;
    }
    // High contrast borders on focus
    .form-demo-default-bg .input__container:focus-within,
    .form-demo-default-bg .select__trigger[aria-expanded="true"],
    .form-demo-default-bg .text-area__container:focus-within {
        border-color: var(--color-brand-primary) !important;
    }
\`}</style>

<form className="form-demo form-demo-default-bg">
    {/* Form fields... */}
    <Button kind="success">Send Message</Button>
</form>`;

const ContactFormDefaultBgDemo = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Custom class for this specific instance to override parent styles
    const instanceId = "contact-form-default-bg-demo";

    return (
        <DemoCard
            sourceCode={codeUsage}
            showSourceToggle={true}
            title="Contact Form (Default Surface)"
            description="Contact form with inputs using the default surface background color"
            className={instanceId} // Pass class to card to target its preview
        >
            <div style={{ padding: 'var(--scale-8)', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <style>{`
                    // Override DemoCard preview background
                    .${instanceId} .demo-card__preview {
                        background-color: var(--color-surface-default) !important;
                    }

                    .form-demo-default-bg .input__container,
                    .form-demo-default-bg .select__trigger,
                    .form-demo-default-bg .text-area__container {
                        background-color: var(--color-surface-default) !important;
                        /* Explicitly set border width and style to ensure visibility */
                        border: 1px solid var(--color-border-strong) !important;
                    }
                    .form-demo-default-bg .input__container:focus-within,
                    .form-demo-default-bg .select__trigger[aria-expanded="true"],
                    .form-demo-default-bg .text-area__container:focus-within {
                         border-color: var(--color-brand-primary) !important;
                    }
                `}</style>
                <form
                    className="form-demo form-demo-default-bg"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--scale-6)',
                        width: '100%',
                        maxWidth: '480px'
                    }}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <Input
                        label="Full Name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        fullWidth
                    />
                    <Input
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        fullWidth
                    />
                    <Select<string>
                        label="Subject"
                        placeholder="Select a subject"
                        options={[
                            { value: 'general', label: 'General Inquiry' },
                            { value: 'support', label: 'Technical Support' },
                            { value: 'sales', label: 'Sales' },
                        ]}
                        value={formData.subject}
                        onChange={(val) => setFormData(prev => ({ ...prev, subject: val || '' }))}
                    />
                    <TextArea
                        label="Message"
                        placeholder="How can we help?"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        fullWidth
                    />
                    <Button type="submit" kind="success" fullWidth>
                        Send Message
                    </Button>
                </form>
            </div>
        </DemoCard>
    );
};

export default ContactFormDefaultBgDemo;
