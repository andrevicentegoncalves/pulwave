import React, { useState, useEffect } from 'react';
const [currentStep, setCurrentStep] = useState(0);
const [user, setUser] = useState(null);
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(false);
const [uploading, setUploading] = useState(false);
const [error, setError] = useState(null);
const [avatarUrl, setAvatarUrl] = useState(null);

// Form data
const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    phone: '',
    account_type: 'individual', // 'individual' or 'company'
    company_name: '',
    vat_id: '',
    country_id: '',
    region_id: '',
    city_id: '', // This might be a UUID if selecting from DB, or text if using autocomplete
    city_name: '', // For autocomplete
    street_name: '',
    number: '',
    floor: '',
    postal_code: '',
    address_type: 'home',
});

// Dropdown data
const [countries, setCountries] = useState([]);
const [regions, setRegions] = useState([]);

// Dynamic steps based on account type
const getSteps = () => {
    const baseSteps = [
        { title: 'Personal Info', icon: User },
        { title: 'Professional', icon: Briefcase },
    ];

    if (formData.account_type === 'company') {
        baseSteps.push({ title: 'Company Details', icon: Building });
    }

    baseSteps.push(
        { title: 'Address', icon: MapPin },
        { title: 'Profile Picture', icon: Camera }
    );

    return baseSteps;
};

const steps = getSteps();

useEffect(() => {
    const fetchUserAndProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Fetch profile using auth_user_id
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('auth_user_id', user.id)
                    .single();

                if (profileError) throw profileError;
                setProfile(profileData);

                // Pre-fill form with existing profile data
                if (profileData) {
                    setFormData(prev => ({
                        ...prev,
                        first_name: profileData.first_name || '',
                        middle_name: profileData.middle_name || '',
                        last_name: profileData.last_name || '',
                        phone: profileData.phone || '',
                    }));

                    // Check for existing onboarding progress
                    const { data: onboardingData } = await supabase
                        .from('user_onboarding')
                        .select('current_step')
                        .eq('profile_id', profileData.id)
                        .single();

                    if (onboardingData) {
                        setCurrentStep(onboardingData.current_step || 0);
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching user/profile:', err);
            setError('Failed to load profile data. Please try refreshing.');
        }
    };

    fetchUserAndProfile();
    fetchCountries();
}, []);

// Fetch Countries
const fetchCountries = async () => {
    try {
        const { data } = await supabase.from('countries').select('id, name, iso_code_2').order('name');
        if (data) setCountries(data);
    } catch (err) {
        console.error('Error fetching countries:', err);
    }
};

// Fetch Regions when Country changes
useEffect(() => {
    const fetchRegions = async () => {
        if (!formData.country_id) {
            setRegions([]);
            return;
        }
        try {
            const { data } = await supabase
                .from('regions')
                .select('id, name')
                .eq('country_id', formData.country_id)
                .order('name');
            if (data) setRegions(data);
        } catch (err) {
            console.error('Error fetching regions:', err);
        }
    };
    fetchRegions();
}, [formData.country_id]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });
};

const handleSelectChange = (name, value) => {
    setFormData({
        ...formData,
        [name]: value,
    });
};

const handleCitySelect = (selection) => {
    setFormData(prev => ({
        ...prev,
        city_name: selection.value,
    }));
};

const handleStreetSelect = (selection) => {
    setFormData(prev => ({
        ...prev,
        street_name: selection.value,
        postal_code: selection.postalCode || prev.postal_code
    }));
};

const saveProgress = async () => {
    if (!user || !profile) return;
    setLoading(true);
    try {
        let addressId = null;

        // 1. Update Profiles (Personal Info)
        const profileUpdates = {
            updated_at: new Date().toISOString(),
            first_name: formData.first_name,
            middle_name: formData.middle_name,
            last_name: formData.last_name,
            phone: formData.phone,
        };

        if (addressId) {
            profileUpdates.primary_address_id = addressId;
        }

        if (avatarUrl) {
            profileUpdates.avatar_url = avatarUrl;
        }

        // Execute the profile update using auth_user_id
        const { error: profileError } = await supabase
            .from('profiles')
            .update(profileUpdates)
            .eq('auth_user_id', user.id);

        if (profileError) throw profileError;

        // 2. Update Professional Profiles (Company Info)
        if (formData.account_type === 'company' || formData.company_name || formData.vat_id) {
            const { data: proData } = await supabase.from('professional_profiles').select('id').eq('profile_id', profile.id).single();

            const proPayload = {
                profile_id: profile.id, // Use profile.id, NOT user.id
                company_name: formData.company_name,
                tax_id: formData.vat_id,
                updated_at: new Date().toISOString()
            };

            if (proData) {
                await supabase.from('professional_profiles').update(proPayload).eq('id', proData.id);
            } else {
                await supabase.from('professional_profiles').insert([proPayload]);
            }
        }

        // 3. Update User Onboarding Progress
        const { data: onboardingData } = await supabase.from('user_onboarding').select('id').eq('profile_id', profile.id).single();

        const onboardingPayload = {
            profile_id: profile.id, // Use profile.id, NOT user.id
            current_step: currentStep,
            total_steps: steps.length,
            updated_at: new Date().toISOString()
        };

        if (onboardingData) {
            await supabase.from('user_onboarding').update(onboardingPayload).eq('id', onboardingData.id);
        } else {
            await supabase.from('user_onboarding').insert([onboardingPayload]);
        }

    } catch (err) {
        console.error('Error saving progress:', err);
    } finally {
        setLoading(false);
    }
};

const handleNext = async () => {
    if (validateStep(currentStep)) {
        await saveProgress(); // Save on every step
        setCurrentStep(currentStep + 1);
        setError(null);
    }
};

const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setError(null);
};

const validateStep = (step) => {
    const stepTitle = steps[step].title;

    if (stepTitle === 'Personal Info') {
        if (!formData.first_name || !formData.last_name) {
            setError('Please enter your first and last name');
            return false;
        }
    } else if (stepTitle === 'Address') {
        if (!formData.country_id) {
            setError('Please select a country');
            return false;
        }
    }
    return true;
};

const handleAvatarUpload = async (e) => {
    try {
        setUploading(true);
        setError(null);
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) throw new Error('Please upload an image file');
        if (file.size > 5 * 1024 * 1024) throw new Error('Image size must be less than 5MB');

        const fileName = `${user.id}-${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(`avatars/${fileName}`, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('profile-images')
            .getPublicUrl(`avatars/${fileName}`);

        // Insert into media_library
        const { error: mediaError } = await supabase
            .from('media_library')
            .insert([{
                uploaded_by: profile.id, // Use profile.id
                title: 'Onboarding Profile Avatar',
                description: 'Profile avatar uploaded during onboarding',
                media_type: 'IMAGE', // Uppercase enum
                file_url: publicUrl,
                file_name: fileName,
                file_size: file.size,
                mime_type: file.type,
                is_public: true,
                created_at: new Date().toISOString()
            }]);

        if (mediaError) console.warn('Failed to log to media_library:', mediaError);

        setAvatarUrl(publicUrl);
    } catch (err) {
        setError(err.message);
        console.error(err);
    } finally {
        setUploading(false);
        if (e.target) e.target.value = '';
    }
};

const handleFinish = async () => {
    console.log('Finishing onboarding...');
    setLoading(true);
    try {
        await saveProgress();

        if (!profile) {
            console.error('No profile found during finish');
            return;
        }

        console.log('Marking onboarding as completed for profile:', profile.id);

        // Mark onboarding as completed in user_onboarding table
        const { data: onboardingData, error: fetchError } = await supabase.from('user_onboarding').select('id').eq('profile_id', profile.id).single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching onboarding data:', fetchError);
        }

        let error;
        if (onboardingData) {
            const { error: updateError } = await supabase
                .from('user_onboarding')
                .update({
                    completed: true,
                    completed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', onboardingData.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('user_onboarding')
                .insert([{
                    profile_id: profile.id,
                    completed: true,
                    completed_at: new Date().toISOString(),
                    current_step: steps.length,
                    total_steps: steps.length
                }]);
            error = insertError;
        }

        if (error) {
            console.error('Error updating onboarding status:', error);
            setError('Failed to complete onboarding. Please try again.');
            return;
        }

        console.log('Onboarding completed successfully. Redirecting...');
        navigate('/profile', { replace: true });
    } catch (err) {
        console.error('Error in handleFinish:', err);
        setError('An unexpected error occurred.');
    } finally {
        setLoading(false);
    }
};

const renderStep = () => {
    const stepTitle = steps[currentStep].title;
    const selectedCountry = countries.find(c => c.id === formData.country_id);
    const countryCode = selectedCountry ? selectedCountry.iso_code_2 : '';

    switch (stepTitle) {
        case 'Personal Info':
            return (
                <div className="onboarding-step">
                    <h3>Let's get to know each other better!</h3>
                    <p className="step-description">I'm gonna be your personal companion, ready to help you reach your goals. Let's reply to some questions, your answers will shape your personalized plan.</p>

                    <div className="form-row-three">
                        <Input
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                            fullWidth
                        />
                        <Input
                            label="Middle Name"
                            name="middle_name"
                            value={formData.middle_name}
                            onChange={handleChange}
                            placeholder="Middle Name"
                            fullWidth
                        />
                        <Input
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                            fullWidth
                        />
                    </div>
                    <Input
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        fullWidth
                    />
                </div>
            );

        case 'Professional':
            return (
                <div className="onboarding-step">
                    <h3>Professional Details 💼</h3>
                    <p className="step-description">Tell us a bit about your professional status.</p>

                    <Select
                        label="Account Type"
                        value={formData.account_type}
                        onChange={(val) => handleSelectChange('account_type', val)}
                        options={[
                            { value: 'individual', label: 'Individual' },
                            { value: 'company', label: 'Company' }
                        ]}
                        fullWidth
                    />

                    <Input
                        label="VAT ID"
                        name="vat_id"
                        value={formData.vat_id}
                        onChange={handleChange}
                        placeholder="VAT123456"
                        fullWidth
                    />
                </div>
            );

        case 'Company Details':
            return (
                <div className="onboarding-step">
                    <h3>Company Details 🏢</h3>
                    <p className="step-description">Tell us about your organization.</p>

                    <Input
                        label="Company Name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Acme Inc."
                        fullWidth
                    />
                </div>
            );

        case 'Address':
            return (
                <div className="onboarding-step">
                    <h3>Where in the world are you? 🌍</h3>
                    <p className="step-description">We'll use this to show you relevant local content</p>

                    <CountrySelect
                        label="Country"
                        value={formData.country_id}
                        onChange={(val) => handleSelectChange('country_id', val)}
                        placeholder="Select Country"
                        fullWidth
                    />

                    <div className="form-row-two">
                        <Select
                            label="Region/State"
                            value={formData.region_id}
                            onChange={(val) => handleSelectChange('region_id', val)}
                            options={regions.map(r => ({ value: r.id, label: r.name }))}
                            placeholder="Select Region"
                            disabled={!formData.country_id}
                            fullWidth
                        />

                        <AddressAutocomplete
                            label="City"
                            type="city"
                            value={formData.city_name}
                            onChange={(val) => setFormData({ ...formData, city_name: val })}
                            onSelect={handleCitySelect}
                            countryCode={countryCode}
                            placeholder="Search city..."
                            disabled={!formData.country_id}
                            fullWidth
                        />
                    </div>

                    <AddressAutocomplete
                        label="Street Address"
                        type="street"
                        value={formData.street_name}
                        onChange={(val) => setFormData({ ...formData, street_name: val })}
                        onSelect={handleStreetSelect}
                        city={formData.city_name}
                        countryCode={countryCode}
                        placeholder="Search street..."
                        disabled={!formData.city_name}
                        fullWidth
                    />

                    <div className="form-row-three">
                        <Input
                            label="Number"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            placeholder="123"
                            fullWidth
                        />
                        <Input
                            label="Floor/Unit"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            placeholder="2A"
                            fullWidth
                        />
                        <Input
                            label="Postal Code"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleChange}
                            placeholder="12345"
                            fullWidth
                        />
                    </div>
                </div>
            );

        case 'Profile Picture':
            return (
                <div className="onboarding-step">
                    <h3>Show us your best side! 📸</h3>

                    <div className="avatar-upload-center">
                        <AvatarUpload
                            src={avatarUrl}
                            alt="Profile"
                            size="l"
                            onUpload={handleAvatarUpload}
                            loading={uploading}
                            className="profile-avatar__preview"
                        />
                    </div>
                </div>
            );

        default:
            return null;
    }
};

return (
    <ContentLayout className="onboarding-layout">
        <div className="profile-onboarding">
            {/* Progress Bar */}
            <div className="onboarding-progress">
                <div className="progress-steps">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`progress-step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                        >
                            <div className="step-circle">
                                <Icon size="s">{React.createElement(step.icon)}</Icon>
                            </div>
                            <span className="step-title">{step.title}</span>
                        </div>
                    ))}
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Card with current step */}
            <Card className="onboarding-card">
                {error && (
                    <Alert type="error" dismissible onDismiss={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {renderStep()}

                {/* Navigation Buttons */}
                <div className="onboarding-actions">
                    {currentStep > 0 && (
                        <Button
                            variant="secondary"
                            size="l"
                            onClick={handleBack}
                        >
                            <Icon size="s" style={{ marginRight: '8px' }}><ArrowLeft /></Icon>
                            Back
                        </Button>
                    )}

                    {currentStep < steps.length - 1 ? (
                        <Button
                            variant="primary"
                            size="l"
                            onClick={handleNext}
                            style={{ marginLeft: 'auto' }}
                        >
                            Next
                            <Icon size="s" style={{ marginLeft: '8px' }}><ArrowRight /></Icon>
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="l"
                            onClick={handleFinish}
                            disabled={loading}
                            style={{ marginLeft: 'auto' }}
                        >
                            <Icon size="s" style={{ marginRight: '8px' }}><CheckCircle /></Icon>
                            {loading ? 'Saving...' : 'Finish'}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    </ContentLayout>
);
};

export default ProfileOnboarding;
