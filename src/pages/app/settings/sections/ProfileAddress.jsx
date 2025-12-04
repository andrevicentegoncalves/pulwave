import React, { useState, useEffect } from 'react';
import { Checkbox, Icon } from '../../../../components/ui';
import { MapPin } from '../../../../components/ui/iconLibrary';
import { AddressForm } from '../../../../components/shared';

const AddressSection = ({
    addressData,
    billingAddressData,
    onAddressChange,
    onBillingAddressChange,
}) => {
    const [sameAsPrimary, setSameAsPrimary] = useState(true);

    // Sync billing with primary if toggle is on
    useEffect(() => {
        if (sameAsPrimary) {
            onBillingAddressChange(addressData);
        }
    }, [sameAsPrimary, addressData]); // Removed onBillingAddressChange from deps to avoid loop if it's not stable

    const handleToggleSameAsPrimary = (e) => {
        setSameAsPrimary(e.target.checked);
    };

    return (
        <div className="profile-section">
            <h2 className="profile-section__title">
                <Icon size="l">
                    <MapPin />
                </Icon>
                Address
            </h2>
            <div className="profile-section__cards">
                {/* Primary Address */}
                <AddressForm
                    title="Primary Address"
                    value={addressData}
                    onChange={onAddressChange}
                    required
                    showAddressType
                />

                {/* Billing Address */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        zIndex: 10
                    }}>
                        <Checkbox
                            label="Same as Primary Address"
                            checked={sameAsPrimary}
                            onChange={handleToggleSameAsPrimary}
                        />
                    </div>
                    <AddressForm
                        title="Billing Address"
                        value={billingAddressData}
                        onChange={onBillingAddressChange}
                        disabled={sameAsPrimary}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddressSection;