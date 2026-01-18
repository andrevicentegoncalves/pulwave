/**
 * Login Form Demo
 * Shows a typical login form with email, password, and remember me option
 */
import React, { useState } from 'react';
import { Input, Button, Checkbox, Link } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Input, Button, Checkbox, Link } from '@ui';

<form className="form-demo">
    <Input 
        type="email" 
        label="Email" 
        placeholder="Enter your email" 
    />
    <Input 
        type="password" 
        label="Password" 
        placeholder="Enter your password" 
    />
    <div className="form-row">
        <Checkbox label="Remember me" />
        <Link href="#">Forgot password?</Link>
    </div>
    <Button type="submit" kind="primary" fullWidth>
        Sign In
    </Button>
</form>`;

const LoginFormDemo = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    return (
        <DemoCard
            sourceCode={codeUsage}
            showSourceToggle={true}
            title="Login Form"
            description="A standard login form with email, password, remember me, and forgot password link"
        >
            <form
                className="form-demo"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--scale-6)',
                    maxWidth: '360px'
                }}
                onSubmit={(e) => e.preventDefault()}
            >
                <Input
                    type="email"
                    label="Email"
                    placeholder="Enter your email…"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    fullWidth
                />
                <Input
                    type="password"
                    label="Password"
                    placeholder="Enter your password…"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    fullWidth
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Checkbox
                        label="Remember me"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <a
                        href="#"
                        style={{
                            fontSize: 'var(--font-size-body-s)',
                            color: 'var(--color-brand-primary)'
                        }}
                    >
                        Forgot password?
                    </a>
                </div>
                <Button type="submit" kind="primary" fullWidth>
                    Sign In
                </Button>
            </form>
        </DemoCard>
    );
};

export default LoginFormDemo;
