import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;
let redis: Redis | null = null;

if (REDIS_URL) {
  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
    });
    redis.on("error", (err) => {
      console.warn("Redis client error:", err.message);
    });
  } catch (err) {
    console.error("Failed to initialize Redis client:", err);
  }
}

interface LeakyBucketOptions {
  capacity: number;
  leakRate: number;
}

const memoryBucket = new Map<string, { level: number; lastUpdated: number }>();

const LUA_LEAKY_BUCKET = `
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local leak_rate = tonumber(ARGV[2])
  local capacity = tonumber(ARGV[3])
  local cost = tonumber(ARGV[4])

  local bucket = redis.call('HMGET', key, 'level', 'lastUpdated')
  local level = tonumber(bucket[1]) or 0
  local last_updated = tonumber(bucket[2]) or now

  -- Calculate leaked water since last update
  local delta = math.max(0, (now - last_updated) * leak_rate)
  level = math.max(0, level - delta)

  -- Check capacity
  if level + cost <= capacity then
    level = level + cost
    redis.call('HMSET', key, 'level', level, 'lastUpdated', now)
    redis.call('EXPIRE', key, math.ceil(capacity / leak_rate) + 60)
    return {1, level} -- Allowed
  else
    return {0, level} -- Rate limited
  end
`;

export async function rateLimit(ip: string, options: LeakyBucketOptions): Promise<{ allowed: boolean; level: number }> {
  const key = `ratelimit:leaky:${ip}`;
  const now = Date.now() / 1000;

  if (redis) {
    try {
      // Define command if not already defined
      if (!(redis as any).leakyBucketScript) {
        redis.defineCommand("leakyBucketScript", {
          numberOfKeys: 1,
          lua: LUA_LEAKY_BUCKET,
        });
      }

      const result = await (redis as any).leakyBucketScript(
        key,
        now.toString(),
        options.leakRate.toString(),
        options.capacity.toString(),
        "1"
      );

      return {
        allowed: result[0] === 1,
        level: parseFloat(result[1]),
      };
    } catch (err) {
      console.warn("Redis rate-limiter failed, falling back to memory:", err);
    }
  }

  // Memory fallback logic (graceful failure)
  const record = memoryBucket.get(key) || { level: 0, lastUpdated: now };
  const delta = Math.max(0, (now - record.lastUpdated) * options.leakRate);
  let newLevel = Math.max(0, record.level - delta);

  if (newLevel + 1 <= options.capacity) {
    newLevel += 1;
    memoryBucket.set(key, { level: newLevel, lastUpdated: now });
    return { allowed: true, level: newLevel };
  }

  return { allowed: false, level: newLevel };
}
