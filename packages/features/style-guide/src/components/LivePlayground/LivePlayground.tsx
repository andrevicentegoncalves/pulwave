/**
 * LivePlayground Component
 * 
 * Interactive component demo area with live controls.
 * Allows users to modify props and see results in real-time.
 */
import React, { useState, useMemo, ReactNode } from 'react';
import { Card, Select, Text } from "@pulwave/ui";
import './styles/_index.scss';

export interface PlaygroundControl {
    name: string;
    type: 'select' | 'boolean' | 'text' | 'number';
    options?: string[];
    defaultValue: any;
    label?: string;
}

export interface LivePlaygroundProps {
    /** The component to render */
    component: React.ElementType;
    /** Default props to pass to component */
    defaultProps?: Record<string, any>;
    /** Controllable props with UI controls */
    controls?: PlaygroundControl[];
    /** Optional children to render inside component */
    children?: ReactNode;
    /** Additional class name */
    className?: string;
}

export const LivePlayground = ({
    component: Component,
    defaultProps = {},
    controls = [],
    children,
    className = '',
}: LivePlaygroundProps) => {
    // Initialize state from controls
    const initialState = useMemo(() => {
        const state: Record<string, any> = { ...defaultProps };
        controls.forEach(control => {
            state[control.name] = control.defaultValue;
        });
        return state;
    }, [defaultProps, controls]);

    const [props, setProps] = useState(initialState);

    const handleChange = (name: string, value: any) => {
        setProps(prev => ({ ...prev, [name]: value }));
    };

    const renderControl = (control: PlaygroundControl) => {
        switch (control.type) {
            case 'select':
                return (
                    <div key={control.name} className="live-playground__control">
                        <Text as="label" variant="label" className="live-playground__label">{control.label || control.name}</Text>
                        <select
                            className="live-playground__select"
                            value={props[control.name]}
                            onChange={(e) => handleChange(control.name, e.target.value)}
                        >
                            {control.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                );
            case 'boolean':
                return (
                    <div key={control.name} className="live-playground__control live-playground__control--checkbox">
                        <Text as="label" variant="label" className="live-playground__checkbox-label">
                            <input
                                type="checkbox"
                                checked={props[control.name]}
                                onChange={(e) => handleChange(control.name, e.target.checked)}
                            />
                            {control.label || control.name}
                        </Text>
                    </div>
                );
            case 'text':
                return (
                    <div key={control.name} className="live-playground__control">
                        <Text as="label" variant="label" className="live-playground__label">{control.label || control.name}</Text>
                        <input
                            type="text"
                            className="live-playground__input"
                            value={props[control.name]}
                            onChange={(e) => handleChange(control.name, e.target.value)}
                        />
                    </div>
                );
            case 'number':
                return (
                    <div key={control.name} className="live-playground__control">
                        <Text as="label" variant="label" className="live-playground__label">{control.label || control.name}</Text>
                        <input
                            type="number"
                            className="live-playground__input"
                            value={props[control.name]}
                            onChange={(e) => handleChange(control.name, Number(e.target.value))}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`live-playground ${className}`}>
            <Card className="live-playground__preview">
                <div className="live-playground__preview-area">
                    <Component {...props}>{children}</Component>
                </div>
            </Card>

            {controls.length > 0 && (
                <div className="live-playground__controls">
                    <Text as="h4" variant="heading-s" className="live-playground__controls-title">Controls</Text>
                    <div className="live-playground__controls-grid">
                        {controls.map(renderControl)}
                    </div>
                </div>
            )}
        </div>
    );
};

LivePlayground.displayName = 'LivePlayground';

export default LivePlayground;
