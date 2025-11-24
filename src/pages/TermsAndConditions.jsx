import React from 'react';
import { ContentLayout, Card } from '../components/ui';

const TermsAndConditions = () => {
    return (
        <ContentLayout>
            <Card header={<h1 className="text-2xl font-bold">Terms and Conditions</h1>}>
                <div className="prose max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Introduction</h3>
                    <p>Welcome to Pulwave. By accessing our website, you agree to be bound by these Terms and Conditions.</p>

                    <h3>2. Use of Service</h3>
                    <p>You agree to use our service for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>

                    <h3>3. User Accounts</h3>
                    <p>To access certain features of the website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password.</p>

                    <h3>4. Intellectual Property</h3>
                    <p>The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and other proprietary laws.</p>

                    <h3>5. Termination</h3>
                    <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                    <h3>6. Changes to Terms</h3>
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>

                    <h3>7. Contact Us</h3>
                    <p>If you have any questions about these Terms, please contact us.</p>
                </div>
            </Card>
        </ContentLayout>
    );
};

export default TermsAndConditions;
