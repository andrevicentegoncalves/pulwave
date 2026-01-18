---
name: infrastructure-testing
description: Specialist in testing cloud infrastructure, networking, and deployment reliability.
version: 1.0.0
tags: [Testing, Infra, AWS, Chaos, Reliability]
---

# Infrastructure Testing

Expertise in validating the resilience, security, and performance of the underlying platform.

## Expertise
- **IaC Testing**: Validating Terraform/Pulumi plan outputs and state.
- **Chaos Engineering**: Simulating failures (instance loss, network partitions) to verify resilience.
- **Load & Stress Testing**: Identifying system breaking points under high traffic (k6, Locust).
- **Security Scans**: Automated auditing of cloud configs (Checkov, Terrascan).
- **Environment Parity**: Ensuring Dev, Staging, and Prod have identical configurations.

## Workflow
1. **Model Failures**: Identify critical infra dependencies and target them for chaos tests.
2. **Script Scans**: Integrate IaC linting and security scanning into CI.
3. **Execute Load Tests**: Simulate peak traffic and monitor system bottleneck.
4. **Automate Recovery**: Verify that auto-scaling and self-healing work as expected.
5. **Audit Parity**: Regularly sync and verify environment configurations.

## Scoring (0-10)
- **10**: 100% IaC coverage, regular chaos tests, automated load testing, zero-drift infra.
- **7**: Secure cloud configs, basic load tests, manual infra verification occasionally.
- **3**: Fragile infra, manual tweaks, no security scanning, frequent "it worked in staging".
- **0**: Unreliable infra, zero testing, frequent outages due to configuration.

## Full Compiled Guide

**Category Guide**: [../testing/AGENTS.md](../testing/AGENTS.md) - Complete testing category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples
