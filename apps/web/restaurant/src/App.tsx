import { Routes, Route } from 'react-router-dom';
import { Button, Card } from '@pulwave/ui';
import './styles/_app.scss';

/**
 * Restaurant App - Main Application Component
 */
export const App = () => {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </div>
    );
};

/**
 * HomePage - Landing page for restaurant app
 */
const HomePage = () => {
    return (
        <div className="app-home">
            <Card>
                <h1>Pulwave Restaurant</h1>
                <p>Restaurant management application - Coming soon</p>
                <Button kind="primary">Get Started</Button>
            </Card>
        </div>
    );
};

export default App;
