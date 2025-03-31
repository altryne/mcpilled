import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Simple configuration for Cloudflare deployment
export default defineCloudflareConfig({
  // OpenNext doesn't support onError in its type definition
  // Keep this minimal to avoid compatibility issues
});
