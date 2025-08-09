export interface Env {
  DB: D1Database;
  USERS: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // User registration
      if (path === '/api/auth/register' && request.method === 'POST') {
        const body = await request.json();
        const { email, username, password } = body;

        // Hash password (in production, use proper hashing)
        const hashedPassword = btoa(password); // Simple base64 for demo

        // Store user in D1
        const result = await env.DB.prepare(
          'INSERT INTO users (email, username, password_hash, created_at) VALUES (?, ?, ?, ?)'
        ).bind(email, username, hashedPassword, new Date().toISOString()).run();

        // Store user data in KV for quick access
        await env.USERS.put(username, JSON.stringify({
          email,
          username,
          created_at: new Date().toISOString()
        }));

        return new Response(JSON.stringify({ success: true, userId: result.meta.last_row_id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // User login
      if (path === '/api/auth/login' && request.method === 'POST') {
        const body = await request.json();
        const { username, password } = body;

        const hashedPassword = btoa(password);
        
        const user = await env.DB.prepare(
          'SELECT * FROM users WHERE username = ? AND password_hash = ?'
        ).bind(username, hashedPassword).first();

        if (user) {
          // Generate simple session token (in production, use JWT)
          const sessionToken = btoa(`${username}:${Date.now()}`);
          
          return new Response(JSON.stringify({ 
            success: true, 
            user: { username: user.username, email: user.email },
            sessionToken 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else {
          return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // Get user profile
      if (path.startsWith('/api/users/') && request.method === 'GET') {
        const username = path.split('/').pop();
        const userData = await env.USERS.get(username);
        
        if (userData) {
          return new Response(userData, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else {
          return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};