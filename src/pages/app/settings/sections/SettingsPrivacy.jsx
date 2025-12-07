import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Modal, Badge, Checkbox, SectionHeader } from '../../../../components/ui';
import { ShieldCheck } from '../../../../components/ui/iconLibrary';
import { LegalDocumentCard } from '../../../../components/shared';
// import { TermsContent } from '../../TermsAndConditions';
// import { PrivacyContent } from '../../PrivacyPolicy';
import { supabase } from '../../../../lib/supabaseClient';

const PrivacySection = ({ formData, onChange, onCheckboxChange }) => {
    const navigate = useNavigate();
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [hasScrolledTerms, setHasScrolledTerms] = useState(false);
    const [hasScrolledPrivacy, setHasScrolledPrivacy] = useState(false);
    const [termsData, setTermsData] = useState(null);
    const [privacyData, setPrivacyData] = useState(null);
    const termsContentRef = useRef(null);
    const privacyContentRef = useRef(null);

    // Fetch current legal document versions
    useEffect(() => {
        const fetchLegalDocuments = async () => {
            try {
                const { data: terms } = await supabase
                    .from('legal_documents')
                    .select('*')
                    .eq('document_type', 'terms')
                    .eq('is_current', true)
                    .single();

                const { data: privacy } = await supabase
                    .from('legal_documents')
                    .select('*')
                    .eq('document_type', 'privacy_policy')
                    .eq('is_current', true)
                    .single();

                setTermsData(terms);
                setPrivacyData(privacy);
            } catch (err) {
                console.error('Error fetching legal documents:', err);
            }
        };

        fetchLegalDocuments();
    }, []);

    const handleScrollTerms = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 10) {
            setHasScrolledTerms(true);
        }
    };

    const handleScrollPrivacy = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 10) {
            setHasScrolledPrivacy(true);
        }
    };

    // Auto-enable accept if content doesn't need scrolling
    useEffect(() => {
        if (showTermsModal && termsContentRef.current && termsData) {
            // Small delay to ensure content is rendered
            const timer = setTimeout(() => {
                const content = termsContentRef.current;
                if (content) {
                    const needsScroll = content.scrollHeight > content.clientHeight;
                    if (!needsScroll) {
                        setHasScrolledTerms(true);
                    }
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [showTermsModal, termsData]);

    useEffect(() => {
        if (showPrivacyModal && privacyContentRef.current && privacyData) {
            const timer = setTimeout(() => {
                const content = privacyContentRef.current;
                if (content) {
                    const needsScroll = content.scrollHeight > content.clientHeight;
                    if (!needsScroll) {
                        setHasScrolledPrivacy(true);
                    }
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [showPrivacyModal, privacyData]);

    const handleAcceptTerms = async () => {
        if (!termsData) return;

        const acceptedAt = new Date().toISOString();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        terms_accepted_version: termsData.version,
                        terms_accepted_at: acceptedAt,
                        updated_at: new Date().toISOString()
                    })
                    .eq('auth_user_id', user.id);

                if (!error) {
                    onChange({
                        target: {
                            name: 'terms_accepted_version',
                            value: termsData.version
                        }
                    });
                    onChange({
                        target: {
                            name: 'terms_accepted_at',
                            value: acceptedAt
                        }
                    });
                }
            }
        } catch (err) {
            console.error('Error saving terms acceptance:', err);
        }

        setShowTermsModal(false);
    };

    const handleAcceptPrivacy = async () => {
        if (!privacyData) return;

        const acceptedAt = new Date().toISOString();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        privacy_accepted_version: privacyData.version,
                        privacy_accepted_at: acceptedAt,
                        updated_at: new Date().toISOString()
                    })
                    .eq('auth_user_id', user.id);

                if (!error) {
                    onChange({
                        target: {
                            name: 'privacy_accepted_version',
                            value: privacyData.version
                        }
                    });
                    onChange({
                        target: {
                            name: 'privacy_accepted_at',
                            value: acceptedAt
                        }
                    });
                }
            }
        } catch (err) {
            console.error('Error saving privacy acceptance:', err);
        }

        setShowPrivacyModal(false);
    };

    const openTermsModal = () => {
        setShowTermsModal(true);
        setHasScrolledTerms(false);
    };

    const openPrivacyModal = () => {
        setShowPrivacyModal(true);
        setHasScrolledPrivacy(false);
    };

    return (
        <div className="profile-section">
            <SectionHeader icon={ShieldCheck} title="Privacy" />
            <div className="profile-section__cards">
                {/* Legal Documents Card */}
                <Card header={<h3>Legal Documents</h3>}>
                    <div className="profile-form-grid">
                        {/* Terms & Conditions */}
                        <div className="privacy-document">
                            <LegalDocumentCard
                                title="Terms & Conditions"
                                version={formData.terms_accepted_version}
                                acceptedAt={formData.terms_accepted_at}
                                onView={openTermsModal}
                            />

                            {/* Privacy Policy */}
                            <LegalDocumentCard
                                title="Privacy Policy"
                                version={formData.privacy_accepted_version}
                                acceptedAt={formData.privacy_accepted_at}
                                onView={openPrivacyModal}
                            />
                        </div>
                    </div>
                </Card>

                {/* Content Settings Card */}
                <Card header={<h3>Content Settings</h3>}>
                    <div className="profile-form-grid">
                        <div className="form-row-two">
                            <Checkbox
                                label="Data Processing Consent"
                                name="data_processing_consent"
                                checked={formData.data_processing_consent ?? false}
                                onChange={onCheckboxChange}
                                helperText="I consent to the processing of my personal data"
                            />

                            <Checkbox
                                label="Marketing Communications"
                                name="marketing_consent"
                                checked={formData.marketing_consent ?? false}
                                onChange={onCheckboxChange}
                                helperText="I agree to receive marketing communications"
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Terms & Conditions Modal */}
            <Modal
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                title="Terms & Conditions"
                size="large"
                footer={
                    <div className="privacy-modal__footer">
                        <Button variant="outline" onClick={() => setShowTermsModal(false)}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAcceptTerms}
                            disabled={!hasScrolledTerms}
                        >
                            {hasScrolledTerms ? 'Accept Terms' : 'Scroll to Accept'}
                        </Button>
                    </div>
                }
            >
                <div
                    ref={termsContentRef}
                    onScroll={handleScrollTerms}
                    className="privacy-modal__content"
                >
                    <div
                        className="privacy-modal__text"
                        dangerouslySetInnerHTML={{
                            __html: termsData?.content?.replace(/\n\n/g, '</p><p style="margin-bottom: var(--spacing-4);">') ||
                                '<p>Terms and Conditions content will be displayed here.</p>'
                        }}
                    />
                </div>
            </Modal>

            {/* Privacy Policy Modal */}
            <Modal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                title="Privacy Policy"
                size="large"
                footer={
                    <div className="privacy-modal__footer">
                        <Button variant="outline" onClick={() => setShowPrivacyModal(false)}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAcceptPrivacy}
                            disabled={!hasScrolledPrivacy}
                        >
                            {hasScrolledPrivacy ? 'Accept Policy' : 'Scroll to Accept'}
                        </Button>
                    </div>
                }
            >
                <div
                    ref={privacyContentRef}
                    onScroll={handleScrollPrivacy}
                    className="privacy-modal__content"
                >
                    <div
                        className="privacy-modal__text"
                        dangerouslySetInnerHTML={{
                            __html: privacyData?.content?.replace(/\n\n/g, '</p><p style="margin-bottom: var(--spacing-4);">') ||
                                '<p>Privacy Policy content will be displayed here.</p>'
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
};

PrivacySection.propTypes = {
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
};

export default PrivacySection;
