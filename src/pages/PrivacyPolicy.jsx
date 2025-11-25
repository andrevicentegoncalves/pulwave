import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui';
import ContentLayout from '../components/layouts/ContentLayout';
import { supabase } from '../lib/supabaseClient';

export const PrivacyContent = ({ content }) => {
    if (!content) return <p>Loading...</p>;

    // Convert markdown-style content to formatted text
    const formattedContent = content
        .replace(/\\n/g, '\n')  // Convert escaped newlines to actual newlines
        .replace(/##\s+/g, '\n\n')  // Add spacing before headers
        .replace(/#\s+/g, '\n\n');  // Add spacing before main headers

    return (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
            {formattedContent}
        </div>
    );
};

const PrivacyPolicy = () => {
    const [privacyData, setPrivacyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrivacy = async () => {
            try {
                const { data, error } = await supabase
                    .from('legal_documents')
                    .select('*')
                    .eq('document_type', 'privacy_policy')
                    .eq('is_current', true)
                    .single();

                if (error) throw error;
                setPrivacyData(data);
            } catch (err) {
                console.error('Error fetching privacy policy:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrivacy();
    }, []);

    if (loading) {
        return (
            <ContentLayout>
                <Card header={<h1 className="text-2xl font-bold">Privacy Policy</h1>}>
                    <p>Loading...</p>
                </Card>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout>
            <Card header={
                <div>
                    <h1 className="text-2xl font-bold">Privacy Policy</h1>
                    {privacyData && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Version {privacyData.version} • Effective {new Date(privacyData.effective_date).toLocaleDateString()}
                        </p>
                    )}
                </div>
            }>
                <PrivacyContent content={privacyData?.content} />
            </Card>
        </ContentLayout>
    );
};

export default PrivacyPolicy;
