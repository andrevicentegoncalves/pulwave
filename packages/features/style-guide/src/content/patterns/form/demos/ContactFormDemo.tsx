/**
 * Basic Contact Form Demo
 * Shows a typical contact form using Input, TextArea, and Button components
 */
import React, { useState } from 'react';
import { Input, TextArea, Button, Select } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Input, TextArea, Button, Select } from '@ui';

<form className="form-demo">
    <Input 
        label="Full Name" 
        placeholder="Enter your name" 
        required 
    />
    <Input 
        type="email" 
        label="Email" 
        placeholder="you@example.com" 
        required 
    />
    <Select
        label="Subject"
        placeholder="Select a subject"
        options={[
            { value: 'general', label: 'General Inquiry' },
            { value: 'support', label: 'Technical Support' },
            { value: 'sales', label: 'Sales' },
        ]}
    />
    <TextArea 
        label="Message" 
        placeholder="How can we help?" 
        rows={4}
    />
    <Button type="submit" kind="primary">
        Send Message
    </Button>
</form>`;

const ContactFormDemo = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    return (
        <DemoCard
            sourceCode={codeUsage}
            showSourceToggle={true}
            title="Contact Form"
            description="A typical contact form with name, email, subject, and message fields"
        >
            <form
                className="form-demo"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--scale-6)',
                    maxWidth: '480px'
                }}
                onSubmit={(e) => e.preventDefault()}
            >
                <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    fullWidth
                />
                <Input
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    onChange={(val) => setFormData({ ...formData, subject: val || '' })}
                />
                <TextArea
                    label="Message"
                    placeholder="How can we help?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    fullWidth
                />
                <Button type="submit" kind="primary" fullWidth>
                    Send Message
                </Button>
            </form>
        </DemoCard>
    );
};

export default ContactFormDemo;
