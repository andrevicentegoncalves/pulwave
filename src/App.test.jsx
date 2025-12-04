import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
    it('matches snapshot', () => {
        const { asFragment } = render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
