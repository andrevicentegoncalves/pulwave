# Reliability & Resilience

## Circuit Breakers

Prevent cascading failures by stopping calls to a failing service.

### States
1. **Closed** (Normal): Request flows through.
2. **Open** (Tripped): Request fails immediately (fail fast).
3. **Half-Open** (Trial): Allow limited requests to check recovery.

### Implementation (Opossum/Polly)
```javascript
const breaker = new CircuitBreaker(expensiveCall, {
  timeout: 3000, // If function takes longer than 3 seconds, fail
  errorThresholdPercentage: 50, // When 50% of requests fail, trip
  resetTimeout: 30000 // After 30 seconds, try again (Half-Open)
});

breaker.fallback(() => 'Service Unavailable');
```

## Bulkheads

Isolating elements into pools so if one fails, the others continue to function.
*Analogy*: Ship compartments.

### Patterns
- **Thread Pools**: Separate pool for Image API vs User API.
- **Connection Pools**: Specific DB connection limit per service.

## Rate Limiting

Protecting resources from abuse or traffic spikes.

### Strategies
- **Fixed Window**: 100 req / minute. (Spike at minute boundary issue)
- **Sliding Window Log**: Precise but high memory.
- **Token Bucket**: Flexible (allows bursts).
- **Leaky Bucket**: Smooths traffic (constant outflow).

### Distributed Rate Limiting
Uses Redis/Lua scripts to maintain counters across instances.

## Graceful Degradation

Designing systems to offer partial functionality when dependencies fail.

| Scenario | Standard Behavior | Graceful Degradation |
|----------|-------------------|----------------------|
| Recommendations API Down | Error 500 Page | Show "Popular items" (Cached) |
| Search Slow | Timeout Error | Show specific category links |
| Image CDN Fail | Broken Images | Show colored placeholders |

## Chaos Engineering

Proactively testing failure modes.

### Principles
1. Start with "Steady State" hypothesis.
2. Introduce real-world events (kill server, latency spike).
3. Observe system behavior.
4. Fix weaknesses.

### Chaos Monkey / Gremlin
Automated tools to randomly terminate instances or inject faults in production/staging.
