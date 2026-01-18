/**
 * DebugTestPage - Minimal page to isolate performance issues
 * Step 1: Completely blank - no imports
 */
export const DebugTestPage = () => {
    return (
        <div style={{
            padding: '20px',
            background: '#111',
            color: '#fff',
            minHeight: '100vh'
        }}>
            <h1>Debug Test Page</h1>
            <p>Step 1: Blank page - No external imports</p>
            <p>Time: {new Date().toISOString()}</p>
        </div>
    );
};

export default DebugTestPage;
