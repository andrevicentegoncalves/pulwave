/**
 * GitHub Provider
 *
 * Provider-agnostic wrapper for GitHub API operations.
 */

import { Octokit } from '@octokit/rest';
import type { DataProvider } from '@pulwave/mcp-core';

export interface GitHubConfig {
    /** GitHub personal access token */
    token: string;
    /** Default owner for repository operations */
    defaultOwner?: string;
    /** Default repository name */
    defaultRepo?: string;
}

export interface PullRequest {
    number: number;
    title: string;
    state: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    labels: string[];
    draft: boolean;
    mergeable: boolean | null;
    url: string;
}

export interface Issue {
    number: number;
    title: string;
    state: string;
    author: string;
    createdAt: string;
    labels: string[];
    assignees: string[];
    url: string;
}

export interface Repository {
    name: string;
    fullName: string;
    description: string | null;
    private: boolean;
    defaultBranch: string;
    language: string | null;
    stargazers: number;
    forks: number;
    openIssues: number;
    url: string;
}

export interface Branch {
    name: string;
    sha: string;
    protected: boolean;
}

export interface Commit {
    sha: string;
    message: string;
    author: string;
    date: string;
    url: string;
}

/**
 * GitHub data provider
 */
export class GitHubProvider implements DataProvider {
    name = 'github';
    private client: Octokit | null = null;
    private config: GitHubConfig;

    constructor(config: GitHubConfig) {
        this.config = config;
    }

    async isConnected(): Promise<boolean> {
        if (!this.client) return false;
        try {
            await this.client.users.getAuthenticated();
            return true;
        } catch {
            return false;
        }
    }

    async connect(): Promise<void> {
        this.client = new Octokit({
            auth: this.config.token,
        });
    }

    async disconnect(): Promise<void> {
        this.client = null;
    }

    getClient(): Octokit {
        if (!this.client) {
            throw new Error('GitHub client not connected. Call connect() first.');
        }
        return this.client;
    }

    private resolveOwnerRepo(owner?: string, repo?: string): { owner: string; repo: string } {
        const resolvedOwner = owner ?? this.config.defaultOwner;
        const resolvedRepo = repo ?? this.config.defaultRepo;

        if (!resolvedOwner || !resolvedRepo) {
            throw new Error('Owner and repo are required. Provide them or set defaults in config.');
        }

        return { owner: resolvedOwner, repo: resolvedRepo };
    }

    // Repository operations

    async getRepository(owner?: string, repo?: string): Promise<Repository> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const { data } = await this.getClient().repos.get({ owner: o, repo: r });

        return {
            name: data.name,
            fullName: data.full_name,
            description: data.description,
            private: data.private,
            defaultBranch: data.default_branch,
            language: data.language,
            stargazers: data.stargazers_count,
            forks: data.forks_count,
            openIssues: data.open_issues_count,
            url: data.html_url,
        };
    }

    async listRepositories(options?: {
        type?: 'all' | 'owner' | 'public' | 'private' | 'member';
        sort?: 'created' | 'updated' | 'pushed' | 'full_name';
        perPage?: number;
        page?: number;
    }): Promise<Repository[]> {
        const { data } = await this.getClient().repos.listForAuthenticatedUser({
            type: options?.type ?? 'all',
            sort: options?.sort ?? 'updated',
            per_page: options?.perPage ?? 30,
            page: options?.page ?? 1,
        });

        return data.map((repo) => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            private: repo.private,
            defaultBranch: repo.default_branch,
            language: repo.language,
            stargazers: repo.stargazers_count,
            forks: repo.forks_count,
            openIssues: repo.open_issues_count,
            url: repo.html_url,
        }));
    }

    // Branch operations

    async listBranches(owner?: string, repo?: string): Promise<Branch[]> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const { data } = await this.getClient().repos.listBranches({
            owner: o,
            repo: r,
            per_page: 100,
        });

        return data.map((branch) => ({
            name: branch.name,
            sha: branch.commit.sha,
            protected: branch.protected,
        }));
    }

    async getBranch(branchName: string, owner?: string, repo?: string): Promise<Branch> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const { data } = await this.getClient().repos.getBranch({
            owner: o,
            repo: r,
            branch: branchName,
        });

        return {
            name: data.name,
            sha: data.commit.sha,
            protected: data.protected,
        };
    }

    // Commit operations

    async listCommits(
        options?: {
            sha?: string;
            path?: string;
            author?: string;
            since?: string;
            until?: string;
            perPage?: number;
            page?: number;
        },
        owner?: string,
        repo?: string
    ): Promise<Commit[]> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const { data } = await this.getClient().repos.listCommits({
            owner: o,
            repo: r,
            sha: options?.sha,
            path: options?.path,
            author: options?.author,
            since: options?.since,
            until: options?.until,
            per_page: options?.perPage ?? 30,
            page: options?.page ?? 1,
        });

        return data.map((commit) => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author?.name ?? 'Unknown',
            date: commit.commit.author?.date ?? '',
            url: commit.html_url,
        }));
    }

    // Pull Request operations

    async listPullRequests(
        options?: {
            state?: 'open' | 'closed' | 'all';
            head?: string;
            base?: string;
            sort?: 'created' | 'updated' | 'popularity' | 'long-running';
            direction?: 'asc' | 'desc';
            perPage?: number;
            page?: number;
        },
        owner?: string,
        repo?: string
    ): Promise<PullRequest[]> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const { data } = await this.getClient().pulls.list({
            owner: o,
            repo: r,
            state: options?.state ?? 'open',
            head: options?.head,
            base: options?.base,
            sort: options?.sort ?? 'created',
            direction: options?.direction ?? 'desc',
            per_page: options?.perPage ?? 30,
            page: options?.page ?? 1,
        });

        return data.map((pr) => ({
            number: pr.number,
            title: pr.title,
            state: pr.state,
            author: pr.user?.login ?? 'Unknown',
            createdAt: pr.created_at,
            updatedAt: pr.updated_at,
            labels: pr.labels.map((l) => (typeof l === 'string' ? l : l.name ?? '')),
            draft: pr.draft ?? false,
            mergeable: null, // Only available in detailed PR response
            url: pr.html_url,
        }));
    }

    async getPullRequest(prNumber: number, owner?: string, repo?: string): Promise<PullRequest> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const { data } = await this.getClient().pulls.get({
            owner: o,
            repo: r,
            pull_number: prNumber,
        });

        return {
            number: data.number,
            title: data.title,
            state: data.state,
            author: data.user?.login ?? 'Unknown',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            labels: data.labels.map((l) => (typeof l === 'string' ? l : l.name ?? '')),
            draft: data.draft ?? false,
            mergeable: data.mergeable,
            url: data.html_url,
        };
    }

    // Issue operations

    async listIssues(
        options?: {
            state?: 'open' | 'closed' | 'all';
            labels?: string;
            assignee?: string;
            sort?: 'created' | 'updated' | 'comments';
            direction?: 'asc' | 'desc';
            perPage?: number;
            page?: number;
        },
        owner?: string,
        repo?: string
    ): Promise<Issue[]> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const { data } = await this.getClient().issues.listForRepo({
            owner: o,
            repo: r,
            state: options?.state ?? 'open',
            labels: options?.labels,
            assignee: options?.assignee,
            sort: options?.sort ?? 'created',
            direction: options?.direction ?? 'desc',
            per_page: options?.perPage ?? 30,
            page: options?.page ?? 1,
        });

        // Filter out pull requests (GitHub API returns PRs as issues)
        return data
            .filter((issue) => !issue.pull_request)
            .map((issue) => ({
                number: issue.number,
                title: issue.title,
                state: issue.state,
                author: issue.user?.login ?? 'Unknown',
                createdAt: issue.created_at,
                labels: issue.labels.map((l) => (typeof l === 'string' ? l : l.name ?? '')),
                assignees: issue.assignees?.map((a) => a.login) ?? [],
                url: issue.html_url,
            }));
    }

    async getIssue(issueNumber: number, owner?: string, repo?: string): Promise<Issue> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const { data } = await this.getClient().issues.get({
            owner: o,
            repo: r,
            issue_number: issueNumber,
        });

        return {
            number: data.number,
            title: data.title,
            state: data.state,
            author: data.user?.login ?? 'Unknown',
            createdAt: data.created_at,
            labels: data.labels.map((l) => (typeof l === 'string' ? l : l.name ?? '')),
            assignees: data.assignees?.map((a) => a.login) ?? [],
            url: data.html_url,
        };
    }

    // File operations

    async getFileContent(
        path: string,
        options?: { ref?: string },
        owner?: string,
        repo?: string
    ): Promise<{ content: string; sha: string; size: number }> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const { data } = await this.getClient().repos.getContent({
            owner: o,
            repo: r,
            path,
            ref: options?.ref,
        });

        if (Array.isArray(data) || data.type !== 'file') {
            throw new Error(`Path "${path}" is not a file`);
        }

        return {
            content: Buffer.from(data.content, 'base64').toString('utf-8'),
            sha: data.sha,
            size: data.size,
        };
    }

    async listFiles(
        path: string,
        options?: { ref?: string },
        owner?: string,
        repo?: string
    ): Promise<Array<{ name: string; path: string; type: 'file' | 'dir'; size: number }>> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const { data } = await this.getClient().repos.getContent({
            owner: o,
            repo: r,
            path,
            ref: options?.ref,
        });

        if (!Array.isArray(data)) {
            throw new Error(`Path "${path}" is not a directory`);
        }

        return data.map((item) => ({
            name: item.name,
            path: item.path,
            type: item.type as 'file' | 'dir',
            size: item.size,
        }));
    }

    // Search operations

    async searchCode(
        query: string,
        options?: { perPage?: number; page?: number },
        owner?: string,
        repo?: string
    ): Promise<Array<{ path: string; repository: string; url: string }>> {
        const { owner: o, repo: r } = this.resolveOwnerRepo(owner, repo);
        const fullQuery = `${query} repo:${o}/${r}`;

        const { data } = await this.getClient().search.code({
            q: fullQuery,
            per_page: options?.perPage ?? 30,
            page: options?.page ?? 1,
        });

        return data.items.map((item) => ({
            path: item.path,
            repository: item.repository.full_name,
            url: item.html_url,
        }));
    }
}
