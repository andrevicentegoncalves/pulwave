/**
 * Input with Icons Demo
 * Shows inputs with leading and trailing icons (functional)
 */
import { useState } from 'react';
import { Input } from '@ui';
import { Mail, User, Phone, Search, X, Lock, Eye, EyeOff } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Input } from '@ui';
import { useState } from 'react';
import { Search, X, Lock, Eye, EyeOff } from '@ui';

// Clearable search input
const [searchValue, setSearchValue] = useState('');
<Input
    label="Search"
    placeholder="Search…"
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
    leftIcon={<Search size={16} />}
    rightIcon={searchValue && (
        <X size={16} onClick={() => setSearchValue('')} />
    )}
/>

// Password with visibility toggle
const [showPassword, setShowPassword] = useState(false);
<Input
    type={showPassword ? "text" : "password"}
    label="Password"
    leftIcon={<Lock size={16} />}
    rightIcon={
        showPassword
            ? <EyeOff size={16} onClick={() => setShowPassword(false)} />
            : <Eye size={16} onClick={() => setShowPassword(true)} />
    }
/>

// Props: leftIcon, rightIcon (can be clickable elements)`;

const InputWithIconsDemo = () => {
    const [searchValue, setSearchValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Inputs with Icons"
            description="Leading and trailing icon combinations with interactive functionality"
        >
            <div className="demo-grid">
                <Input label="Email" placeholder="Enter email" leftIcon={<Mail size={16} />} />
                <Input label="Username" placeholder="Enter username" leftIcon={<User size={16} />} />
                <Input label="Phone" placeholder="Enter phone" leftIcon={<Phone size={16} />} />
                <Input
                    label="Search"
                    placeholder="Search…"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    leftIcon={<Search size={16} />}
                    rightIcon={searchValue ? (
                        <X size={16} onClick={() => setSearchValue('')} />
                    ) : undefined}
                />
                <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="Enter password"
                    leftIcon={<Lock size={16} />}
                    rightIcon={
                        showPassword
                            ? <EyeOff size={16} onClick={() => setShowPassword(false)} />
                            : <Eye size={16} onClick={() => setShowPassword(true)} />
                    }
                />
            </div>
        </DemoCard>
    );
};

export default InputWithIconsDemo;
