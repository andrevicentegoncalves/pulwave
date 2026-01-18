/**
 * ProfileAddress Section
 *
 * Address form section with primary and billing address fields.
 *
 * @package @pulwave/experience-settings
 */
import { useState, useEffect, type ChangeEvent } from 'react';
import { Checkbox, SectionHeader } from '@pulwave/ui';
import { MapPin } from '@pulwave/ui';
import { AddressForm } from '../AddressForm';
import { useAddressingData } from '../../hooks/useProfileData';

export interface ProfileAddressProps {
    addressing: ReturnType<typeof useAddressingData>;
    loading?: boolean;
}

/**
 * ProfileAddress - Address form section with primary and billing
 */
export const ProfileAddress = ({
    addressing,
    loading = false,
}: ProfileAddressProps) => {
    const { addressData, billingAddressData, setAddressData, setBillingAddressData } = addressing;
    const [sameAsPrimary, setSameAsPrimary] = useState(true);

    // Sync billing with primary if toggle is on
    useEffect(() => {
        if (sameAsPrimary) {
            setBillingAddressData(addressData);
        }
    }, [sameAsPrimary, addressData, setBillingAddressData]);

    const handleToggleSameAsPrimary = (e: ChangeEvent<HTMLInputElement>) => {
        setSameAsPrimary(e.target.checked);
    };

    return (
        <div className="profile-section">
            <SectionHeader icon={MapPin} title="Address" />
            <div className="profile-section__cards">
                {/* Primary Address */}
                <AddressForm
                    title="Primary Address"
                    value={addressData}
                    onChange={setAddressData}
                    showAddressType
                    loading={loading}
                />

                {/* Billing Address */}
                <AddressForm
                    title="Billing Address"
                    value={billingAddressData}
                    onChange={setBillingAddressData}
                    disabled={sameAsPrimary}
                    loading={loading}
                    headerAction={
                        <Checkbox
                            label="Same as Primary Address"
                            checked={sameAsPrimary}
                            onChange={handleToggleSameAsPrimary}
                            size="s"
                        />
                    }
                />
            </div>
        </div>
    );
};

ProfileAddress.displayName = 'ProfileAddress';

export default ProfileAddress;
