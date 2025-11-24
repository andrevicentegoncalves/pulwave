import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Modal } from '../../components/ui';
import Checkbox from '../../components/ui/Checkbox';
import Icon from '../../components/ui/Icon';
import { ShieldCheck } from '../../components/ui/iconLibrary';
import { TermsContent } from '../TermsAndConditions';
import { PrivacyContent } from '../PrivacyPolicy';
import { supabase } from '../../lib/supabaseClient';

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

    const handleAcceptTerms = () => {
        if (!termsData) return;

        // Update version
        onChange({
            target: {
                name: 'terms_accepted_version',
                value: termsData.version
            }
        });
        // Update acceptance timestamp
        onChange({
            target: {
                name: 'terms_accepted_at',
                value: new Date().toISOString()
            }
        });
        setShowTermsModal(false);
    };

    const handleAcceptPrivacy = () => {
        if (!privacyData) return;

        // Update version
        onChange({
            target: {
                name: 'privacy_accepted_version',
                value: privacyData.version
            }
        });
        // Update acceptance timestamp
        onChange({
            target: {
                name: 'privacy_accepted_at',
                value: new Date().toISOString()
            }
        });
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
        <Card
            header={
                <h2 className="profile-form-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                    <Icon size="m" style={{ marginRight: 'var(--space-3)', verticalAlign: 'middle' }}>
                        <ShieldCheck />
                    </Icon>
                    Privacy & Compliance
                </h2>
            }
        >
            <div className="profile-form-grid">
                {/* Legal Documents */}
                <div className="form-item--full">
                    <h3 style={{ marginBottom: 'var(--space-3)' }}>Legal Documents</h3>
                </div>

                {/* Terms & Conditions Section */}
                <div className="form-item--full" style={{ marginBottom: 'var(--space-4)' }}>
                    <h4 style={{ marginBottom: 'var(--space-2)' }}>Terms & Conditions</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                        <Button variant="outline" onClick={openTermsModal}>
                            View Terms & Conditions
                        </Button>
                        <div className="read-only-field" style={{ margin: 0 }}>
                            <label className="input__label" style={{ marginBottom: '2px' }}>Accepted Version</label>
                            <div className="read-only-value">
                                {formData.terms_accepted_version || 'Not Accepted'}
                            </div>
                        </div>
                        <div className="read-only-field" style={{ margin: 0 }}>
                            <label className="input__label" style={{ marginBottom: '2px' }}>Accepted Date</label>
                            <div className="read-only-value">
                                {formData.terms_accepted_at
                                    ? new Date(formData.terms_accepted_at).toLocaleDateString()
                                    : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy Policy Section */}
                <div className="form-item--full" style={{ marginBottom: 'var(--space-4)' }}>
                    <h4 style={{ marginBottom: 'var(--space-2)' }}>Privacy Policy</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                        <Button variant="outline" onClick={openPrivacyModal}>
                            View Privacy Policy
                        </Button>
                        <div className="read-only-field" style={{ margin: 0 }}>
                            <label className="input__label" style={{ marginBottom: '2px' }}>Accepted Version</label>
                            <div className="read-only-value">
                                {formData.privacy_accepted_version || 'Not Accepted'}
                            </div>
                        </div>
                        <div className="read-only-field" style={{ margin: 0 }}>
                            <label className="input__label" style={{ marginBottom: '2px' }}>Accepted Date</label>
                            <div className="read-only-value">
                                {formData.privacy_accepted_at
                                    ? new Date(formData.privacy_accepted_at).toLocaleDateString()
                                    : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consent Settings */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Consent Settings
                    </h3>
                </div>

                <div className="form-row-two">
                    <Checkbox
                        label="Data Processing Consent"
                        name="data_processing_consent"
                        checked={formData.data_processing_consent ?? false}
                        onChange={onCheckboxChange}
                        helperText="Allow us to process your personal data"
                    />
                    <Checkbox
                        label="Marketing Consent"
                        name="marketing_consent"
                        checked={formData.marketing_consent ?? false}
                        onChange={onCheckboxChange}
                        helperText="Receive marketing communications"
                    />
                </div>

                {/* Account Deletion - Only show if requested */}
                {formData.deletion_requested && (
                    <>
                        <div className="form-item--full">
                            <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                                Account Deletion
                            </h3>
                        </div>

                        <div className="form-row-three">
                            <div className="read-only-field">
                                <label className="input__label">Deletion Requested</label>
                                <div className="read-only-value">
                                    {formData.deletion_requested ? '⚠ Yes' : '✓ No'}
                                </div>
                            </div>
                            <div className="read-only-field">
                                <label className="input__label">Requested At</label>
                                <div className="read-only-value">
                                    {formData.deletion_requested_at
                                        ? new Date(formData.deletion_requested_at).toLocaleDateString()
                                        : 'N/A'}
                                </div>
                            </div>
                            <div className="read-only-field">
                                <label className="input__label">Scheduled For</label>
                                <div className="read-only-value">
                                    {formData.deletion_scheduled_for
                                        ? new Date(formData.deletion_scheduled_for).toLocaleDateString()
                                        : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Terms Modal */}
            <Modal
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                title={`Terms and Conditions ${termsData ? `(v${termsData.version})` : ''}`}
                size="lg"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="outline" onClick={() => setShowTermsModal(false)}>
                            Back
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAcceptTerms}
                            disabled={!hasScrolledTerms}
                        >
                            Accept
                        </Button>
                    </div>
                }
            >
                <div
                    ref={termsContentRef}
                    onScroll={handleScrollTerms}
                    style={{
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        paddingRight: 'var(--space-2)'
                    }}
                >
                    <TermsContent content={termsData?.content} />
                </div>
            </Modal>

            {/* Privacy Modal */}
            <Modal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                title={`Privacy Policy ${privacyData ? `(v${privacyData.version})` : ''}`}
                size="lg"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="outline" onClick={() => setShowPrivacyModal(false)}>
                            Back
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAcceptPrivacy}
                            disabled={!hasScrolledPrivacy}
                        >
                            Accept
                        </Button>
                    </div>
                }
            >
                <div
                    ref={privacyContentRef}
                    onScroll={handleScrollPrivacy}
                    style={{
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        paddingRight: 'var(--space-2)'
                    }}
                >
                    <PrivacyContent content={privacyData?.content} />
                </div>
            </Modal>
        </Card>
    );
};

PrivacySection.propTypes = {
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
};

export default PrivacySection;
