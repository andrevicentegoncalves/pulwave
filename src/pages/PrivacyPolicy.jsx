import React from 'react';
import { ContentLayout, Card } from '../components/ui';

const PrivacyPolicy = () => {
    return (
        <ContentLayout>
            <Card header={<h1 className="text-2xl font-bold">Privacy Policy</h1>}>
                <div className="prose max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Information We Collect</h3>
                    <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.</p>

                    <h3>2. How We Use Your Information</h3>
                    <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users.</p>

                    <h3>3. Sharing of Information</h3>
                    <p>We do not share your personal information with third parties except as described in this policy.</p>

                    <h3>4. Data Security</h3>
                    <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

                    <h3>5. Your Choices</h3>
                    <p>You may update, correct or delete information about you at any time by logging into your online account.</p>

                    <h3>6. Changes to this Policy</h3>
                    <p>We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy.</p>

                    <h3>7. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy, please contact us.</p>
                </div>
            </Card>
        </ContentLayout>
    );
};

export default PrivacyPolicy;
