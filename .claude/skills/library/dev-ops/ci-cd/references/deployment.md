# Deployment Strategies

## Methods

### Rolling Update (Standard K8s)
Replace instance N with instance N+1 one by one.
- *Pros*: Zero downtime, no extra infra cost.
- *Cons*: Slow rollback. Mix of old/new code running simultaneously (DB compatibility issues?).

### Blue/Green
Spin up full new environment (Green). Switch Router to Green.
- *Pros*: Instant switch, instant rollback (switch back to Blue), safe testing on Green.
- *Cons*: Double infra cost (running 2x servers).

### Canary
Route 5% of traffic to new version. Monitor errors. Gradually increase to 100%.
- *Pros*: Limits blast radius of bugs.
- *Cons*: Complex routing setup (Service Mesh/ALB required).

## GitOps (ArgoCD)

The "Pull" model.
1. CI pushes Docker Image.
2. CI updates `kubernetes/deployment.yaml` in Git Repo with new tag.
3. ArgoCD (inside cluster) sees Git change and pulls new image.

*Benefit*: Cluster state always matches Git state. No "kubectl apply" from CI.

## Feature Flags

Decouple Deployment from Release.
- Deploy code turned "Off".
- Turn "On" via dashboard for 10% of users.
- *Tool*: LaunchDarkly, PostHog.
