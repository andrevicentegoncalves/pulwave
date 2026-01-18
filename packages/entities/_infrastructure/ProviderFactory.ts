/**
 * Provider Factory
 * Abstract factory for runtime data provider selection.
 * Enables switching between backends (Supabase, Firebase, etc.) via configuration.
 */
import type { IUserRepository } from '../auth/interfaces';
import type { IProfileRepository } from '../profile/interfaces';
import type { IPaymentRepository } from '../payment/interfaces';
import type { IPropertyRepository } from '../property/interfaces';
import type { ISystemRepository } from '../system/interfaces';
import type { ITranslationRepository } from '../translation/interfaces';
import type { IAddressRepository } from '../address/interfaces';
import type { IStorageRepository } from '../storage/interfaces';
import type { ISubscriptionRepository } from '../subscription/interfaces';
import type { IBillingRepository } from '../billing/interfaces';
import type { IFeatureFlagRepository } from '../feature-flags/interfaces';

// Supabase implementations
import { SupabaseUserRepository } from './supabase/auth/SupabaseUserRepository';
import { SupabaseProfileRepository } from './supabase/profile/SupabaseProfileRepository';
import { SupabasePaymentRepository } from './supabase/payment/SupabasePaymentRepository';
import { SupabasePropertyRepository } from './supabase/property/SupabasePropertyRepository';
import { SupabaseSystemRepository } from './supabase/system/SupabaseSystemRepository';
import { SupabaseTranslationRepository } from './supabase/translation/SupabaseTranslationRepository';
import { SupabaseAddressRepository } from './supabase/address/SupabaseAddressRepository';
import { SupabaseStorageRepository } from './supabase/storage/SupabaseStorageRepository';
import { SupabaseSubscriptionRepository } from './supabase/subscription/SupabaseSubscriptionRepository';
import { SupabaseBillingRepository } from './supabase/billing/SupabaseBillingRepository';
import { SupabaseFeatureFlagRepository } from './supabase/feature-flags/SupabaseFeatureFlagRepository';

/**
 * Supported provider types
 */
export type ProviderType = 'supabase' | 'firebase' | 'prisma';

/**
 * Configuration for data provider selection
 */
export interface DataProviderConfig {
    user?: ProviderType;
    profile?: ProviderType;
    payment?: ProviderType;
    property?: ProviderType;
    system?: ProviderType;
    translation?: ProviderType;
    address?: ProviderType;
    storage?: ProviderType;
    subscription?: ProviderType;
    billing?: ProviderType;
    featureFlag?: ProviderType;
}

/**
 * Data provider interface
 */
export interface DataProvider {
    user: IUserRepository;
    profile: IProfileRepository;
    payment: IPaymentRepository;
    property: IPropertyRepository;
    system: ISystemRepository;
    translation: ITranslationRepository;
    address: IAddressRepository;
    storage: IStorageRepository;
    subscription: ISubscriptionRepository;
    billing: IBillingRepository;
    featureFlag: IFeatureFlagRepository;
}

/**
 * Provider registry - maps provider types to implementations
 */
const providerRegistry: Record<string, Record<ProviderType, unknown>> = {
    user: {
        supabase: SupabaseUserRepository,
        firebase: null, // Future: FirebaseUserRepository
        prisma: null,   // Future: PrismaUserRepository
    },
    profile: {
        supabase: SupabaseProfileRepository,
        firebase: null,
        prisma: null,
    },
    payment: {
        supabase: SupabasePaymentRepository,
        firebase: null,
        prisma: null,
    },
    property: {
        supabase: SupabasePropertyRepository,
        firebase: null,
        prisma: null,
    },
    system: {
        supabase: SupabaseSystemRepository,
        firebase: null,
        prisma: null,
    },
    translation: {
        supabase: SupabaseTranslationRepository,
        firebase: null,
        prisma: null,
    },
    address: {
        supabase: SupabaseAddressRepository,
        firebase: null,
        prisma: null,
    },
    storage: {
        supabase: SupabaseStorageRepository,
        firebase: null,
        prisma: null,
    },
    subscription: {
        supabase: SupabaseSubscriptionRepository,
        firebase: null,
        prisma: null,
    },
    billing: {
        supabase: SupabaseBillingRepository,
        firebase: null,
        prisma: null,
    },
    featureFlag: {
        supabase: SupabaseFeatureFlagRepository,
        firebase: null,
        prisma: null,
    },
};

/**
 * Default provider configuration
 */
const defaultConfig: Required<DataProviderConfig> = {
    user: 'supabase',
    profile: 'supabase',
    payment: 'supabase',
    property: 'supabase',
    system: 'supabase',
    translation: 'supabase',
    address: 'supabase',
    storage: 'supabase',
    subscription: 'supabase',
    billing: 'supabase',
    featureFlag: 'supabase',
};

/**
 * Vite environment type for import.meta.env access
 */
interface ViteImportMeta {
    env?: {
        VITE_DATA_PROVIDER?: string;
    };
}

/**
 * Get configuration from environment variables
 */
function getEnvConfig(): DataProviderConfig {
    const envProvider = (
        (typeof process !== 'undefined' && process.env?.DATA_PROVIDER) ||
        (typeof import.meta !== 'undefined' && (import.meta as unknown as ViteImportMeta).env?.VITE_DATA_PROVIDER)
    ) as ProviderType | undefined;

    if (envProvider && ['supabase', 'firebase', 'prisma'].includes(envProvider)) {
        return {
            user: envProvider,
            profile: envProvider,
            payment: envProvider,
            property: envProvider,
            system: envProvider,
            translation: envProvider,
            address: envProvider,
            storage: envProvider,
            subscription: envProvider,
            billing: envProvider,
            featureFlag: envProvider,
        };
    }

    return {};
}

/**
 * Resolve a provider for a given domain
 */
function resolveProvider<T>(domain: string, providerType: ProviderType): T {
    const domainProviders = providerRegistry[domain];

    if (!domainProviders) {
        throw new Error(`[ProviderFactory] Unknown domain: ${domain}`);
    }

    const provider = domainProviders[providerType];

    if (!provider) {
        throw new Error(
            `[ProviderFactory] Provider '${providerType}' not implemented for domain '${domain}'. ` +
            `Available: supabase`
        );
    }

    return provider as T;
}

/**
 * Create a data provider configuration
 * 
 * @param config Optional configuration overrides
 * @returns Data provider with all domain repositories
 * 
 * @example
 * // Use default (Supabase) for all domains
 * const provider = createDataProvider();
 * 
 * @example
 * // Use Firebase for user domain only
 * const provider = createDataProvider({ user: 'firebase' });
 * 
 * @example
 * // Configuration from environment variable
 * // Set VITE_DATA_PROVIDER=firebase in .env
 * const provider = createDataProvider();
 */
export function createDataProvider(config: DataProviderConfig = {}): {
    user: IUserRepository;
    profile: IProfileRepository;
    payment: IPaymentRepository;
    property: IPropertyRepository;
    system: ISystemRepository;
    translation: ITranslationRepository;
    address: IAddressRepository;
    storage: IStorageRepository;
    subscription: ISubscriptionRepository;
    billing: IBillingRepository;
    featureFlag: IFeatureFlagRepository;
} {
    const envConfig = getEnvConfig();
    const mergedConfig: Required<DataProviderConfig> = {
        ...defaultConfig,
        ...envConfig,
        ...config,
    };

    return {
        user: resolveProvider('user', mergedConfig.user),
        profile: resolveProvider('profile', mergedConfig.profile),
        payment: resolveProvider('payment', mergedConfig.payment),
        property: resolveProvider('property', mergedConfig.property),
        system: resolveProvider('system', mergedConfig.system),
        translation: resolveProvider('translation', mergedConfig.translation),
        address: resolveProvider('address', mergedConfig.address),
        storage: resolveProvider('storage', mergedConfig.storage),
        subscription: resolveProvider('subscription', mergedConfig.subscription),
        billing: resolveProvider('billing', mergedConfig.billing),
        featureFlag: resolveProvider('featureFlag', mergedConfig.featureFlag),
    };
}

/**
 * Get list of available providers for a domain
 */
export function getAvailableProviders(domain: string): ProviderType[] {
    const domainProviders = providerRegistry[domain];
    if (!domainProviders) return [];

    return (Object.entries(domainProviders) as [ProviderType, unknown][])
        .filter(([, impl]) => impl !== null)
        .map(([type]) => type);
}

