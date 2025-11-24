import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui';
import ContentLayout from '../components/layouts/ContentLayout';
import { supabase } from '../lib/supabaseClient';

export const TermsContent = ({ content }) => (
    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content || 'Loading...' }} />
);

const TermsAndConditions = () => {
    const [termsData, setTermsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const { data, error } = await supabase
                    .from('legal_documents')
                    .select('*')
                    .eq('document_type', 'terms')
                    .eq('is_current', true)
                    .single();

                if (error) throw error;
                setTermsData(data);
            } catch (err) {
                console.error('Error fetching terms:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTerms();
    }, []);

    if (loading) {
        return (
            <ContentLayout>
                <Card header={<h1 className="text-2xl font-bold">Terms and Conditions</h1>}>
                    <p>Loading...</p>
                </Card>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout>
            <Card header={
                <div>
                    <h1 className="text-2xl font-bold">Terms and Conditions</h1>
                    {termsData && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Version {termsData.version} • Effective {new Date(termsData.effective_date).toLocaleDateString()}
                        </p>
                    )}
                </div>
            }>
                <TermsContent content={termsData?.content} />
            </Card>
        </ContentLayout>
    );
};

export default TermsAndConditions;
