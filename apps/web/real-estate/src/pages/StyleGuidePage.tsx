/**
 * StyleGuidePage - Real Estate App
 * 
 * Renders the full StyleGuideApp component from src.
 */
import { StyleGuideApp } from '@pulwave/pages-style-guide';

interface StyleGuidePageProps {
    newVersion?: boolean;
}

export const StyleGuidePage = () => {
    return <StyleGuideApp />;
};

export default StyleGuidePage;
