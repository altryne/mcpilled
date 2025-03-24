#!/bin/bash

# Create or update .env.local file with OpenAI API key
cat > .env.local << EOL
# Supabase credentials (copy from your existing .env.local)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# OpenAI API key (keep this server-side only)
OPENAI_API_KEY=your-openai-api-key
EOL

echo "Created .env.local template. Please edit it with your actual API keys."
echo "Remember to keep your API keys secure and never commit them to version control."
