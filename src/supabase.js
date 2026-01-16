import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration
 */

const supabaseUrl = 'https://nytofninjfdfzfoqwudj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dG9mbmluamZkZnpmb3F3dWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MTA2ODMsImV4cCI6MjA4NDA4NjY4M30.a7XHn6CtqCbci1SIrULoWIjSviieIyAoXmw6Pqhe9wM';

// Create and export the Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
