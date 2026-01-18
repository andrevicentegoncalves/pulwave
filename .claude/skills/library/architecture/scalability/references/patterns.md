# Scaling Patterns

## Database Scaling

### Sharding
Partitioning data across multiple servers to scale beyond a single node's limits.

- **Key Based**: Partition by hash of key (e.g., `hash(user_id) % n`)
  - *Pros*: Even distribution
  - *Cons*: Resharding is hard
- **Range Based**: Partition by range (e.g., Users A-M, N-Z)
  - *Pros*: Easy implementation
  - *Cons*: Hotspots (e.g., recent timestamps)
- **Directory Based**: Lookup table maps key to shard
  - *Pros*: Flexible
  - *Cons*: Single point of failure (the directory)

### Read Replicas
Separate read and write traffic.
- **Master**: Handles Writes & Reads (or just Writes)
- **Slaves**: Replicate from Master, handle Reads
- **Use Case**: Read-heavy applications (social networks, blogs)

### Federation
Splitting tables by function (e.g., User DB, Product DB, Forum DB).

## Caching Strategies

### Cache-Aside (Lazy Loading)
Application looks in cache. If miss, load from DB, write to cache.
- *Pros*: Only requested data is cached.
- *Cons*: Latency on cache miss.

### Write-Through
Application writes to cache and DB synchronously.
- *Pros*: Data consistency, fast reads.
- *Cons*: Higher write latency.

### Write-Behind (Write-Back)
Application writes to cache. Cache writes to DB asynchronously.
- *Pros*: Fast writes.
- *Cons*: Data loss risk if cache fails before sync.

## Application Scaling

### Stateless Services
Store no session data locally. Session state in Redis/DB.
- Enables trivial horizontal scaling (Auto Scaling Groups).

### Asynchronous Processing
Offload heavy work to background workers via queues.
- **Components**: Producer -> Queue (SQS/Kafka) -> Consumer
- **Use Cases**: Email sending, Image processing, Report generation

### Content Delivery Network (CDN)
Cache static content (images, CSS, JS) at the edge close to users.
- Reduces origin server load.
- Improves global latency.

## Event Driven Architecture

### CQRS (Command Query Responsibility Segregation)
Separate models for updating (Command) and reading (Query).
- Allows optimizing read and write sides independently.

### Event Sourcing
Store state as a sequence of events, not just current state.
- **Pros**: Complete audit trail, time travel, flexible projections.
- **Cons**: Complexity, schema evolution challenges.
