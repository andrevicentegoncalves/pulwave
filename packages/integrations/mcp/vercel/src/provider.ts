/**
 * Vercel Provider
 *
 * Provider-agnostic wrapper for Vercel API operations.
 * This is a shell implementation - methods throw NotImplemented until configured.
 */

import type { DataProvider } from '@pulwave/mcp-core';

export interface VercelConfig {
    /** Vercel API token */
    token: string;
    /** Team ID (optional, for team deployments) */
    teamId?: string;
    /** Default project ID */
    defaultProjectId?: string;
}

// Domain types - ready for when Vercel is configured

export interface Project {
    id: string;
    name: string;
    framework: string | null;
    createdAt: string;
    updatedAt: string;
    targets: Record<string, DeploymentTarget>;
}

export interface DeploymentTarget {
    alias: string[];
    createdAt: string;
    readyState: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED' | 'CANCELED';
}

export interface Deployment {
    id: string;
    name: string;
    url: string;
    state: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED' | 'CANCELED' | 'INITIALIZING';
    createdAt: string;
    buildingAt: string | null;
    ready: string | null;
    creator: { email: string; username: string };
    target: 'production' | 'preview' | null;
    aliasAssigned: boolean;
    meta: Record<string, string>;
}

export interface Domain {
    name: string;
    apexName: string;
    projectId: string;
    verified: boolean;
    createdAt: string;
}

export interface EnvironmentVariable {
    id: string;
    key: string;
    value: string;
    target: ('production' | 'preview' | 'development')[];
    type: 'plain' | 'secret' | 'encrypted';
    createdAt: string;
}

export interface LogEntry {
    id: string;
    message: string;
    timestamp: number;
    type: 'stdout' | 'stderr';
    source: 'build' | 'lambda' | 'static' | 'edge';
}

/**
 * Vercel data provider (shell implementation)
 */
export class VercelProvider implements DataProvider {
    name = 'vercel';
    private config: VercelConfig;
    private connected = false;

    constructor(config: VercelConfig) {
        this.config = config;
    }

    async isConnected(): Promise<boolean> {
        return this.connected && !!this.config.token;
    }

    async connect(): Promise<void> {
        if (!this.config.token) {
            throw new Error('Vercel token not configured');
        }
        this.connected = true;
    }

    async disconnect(): Promise<void> {
        this.connected = false;
    }

    // Project operations

    async listProjects(_options?: {
        limit?: number;
        from?: number;
    }): Promise<Project[]> {
        this.ensureConnected();
        // TODO: Implement when Vercel is configured
        throw new Error('Not implemented: Vercel integration not yet configured');
    }

    async getProject(_projectId: string): Promise<Project> {
        this.ensureConnected();
        throw new Error('Not implemented: Vercel integration not yet configured');
    }

    // Deployment operations

    async listDeployments(_options?: {
        projectId?: string;
        target?: 'production' | 'preview';
        state?: Deployment['state'];
        limit?: number;
        from?: number;
    }): Promise<Deployment[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Vercel integration not yet configured');
    }

    async getDeployment(_deploymentId: string): Promise<Deployment> {
        this.ensureConnected();
        throw new Error('Not implemented: Vercel integration not yet configured');
    }

    async getDeploymentLogs(_deploymentId: string, _options?: {
        follow?: boolean;
        limit?: number;
    }): Promise<LogEntry[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Vercel integration not yet configured');
    }

    // Domain operations

    async listDomains(_projectId?: string): Promise<Domain[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Vercel integration not yet configured');
    }

    async getDomain(_domain: string): Promise<Domain> {
        this.ensureConnected();
        throw new Error('Not implemented: Vercel integration not yet configured');
    }

    // Environment variable operations

    async listEnvVars(_projectId: string): Promise<EnvironmentVariable[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Vercel integration not yet configured');
    }

    async getEnvVar(_projectId: string, _envId: string): Promise<EnvironmentVariable> {
        this.ensureConnected();
        throw new Error('Not implemented: Vercel integration not yet configured');
    }

    // Helper methods

    private ensureConnected(): void {
        if (!this.connected) {
            throw new Error('Provider not connected. Call connect() first.');
        }
    }

    getConfig(): VercelConfig {
        return this.config;
    }
}
