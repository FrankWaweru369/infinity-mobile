<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth, setToken } from '$lib/services/api';
  
  let form = {
    email: '',
    password: ''
  };
  
  let loading = false;
  let error = '';
  let showPassword = false;
  let rememberMe = false;
  
  async function handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    form = { ...form, [input.name]: input.value };
  }
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    
    console.log('Attempting login with:', form.email);
    
    try {
      const data = await auth.login(form);
      console.log('Login response:', data);
      
      if (data.token) {
        setToken(data.token);
        console.log('Token stored, redirecting to dashboard...');
        goto('/dashboard');
      } else {
        console.log('No token in response');
        error = 'Login successful but no token received';
      }
      
    } catch (err) {
      console.error('Login error:', err);
      error = err instanceof Error ? err.message : 'Login failed';
    } finally {
      loading = false;
    }
  }
</script>

<!-- rest of your login form HTML stays exactly the same -->
<div class="login-container">
  <form on:submit={handleSubmit} class="login-form">
    <div class="logo-section">
      <h1 class="infinity-symbol">∞</h1>
      <h2 class="title">Welcome Back</h2>
      <p class="subtitle">Sign in to continue to Infinity</p>
    </div>

    {#if error}
      <div class="alert error">
        <span>⚠️</span> {error}
      </div>
    {/if}

    <div class="input-group">
      <input
        type="email"
        name="email"
        placeholder=" "
        value={form.email}
        on:input={handleChange}
        required
      />
      <label>Email</label>
    </div>

    <div class="input-group">
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        placeholder=" "
        value={form.password}
        on:input={handleChange}
        required
      />
      <label>Password</label>
      <button
        type="button"
        class="toggle-password"
        on:click={() => showPassword = !showPassword}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>

    <div class="options-group">
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={rememberMe} />
        <span>Remember me</span>
      </label>
      <a href="/forgot-password" class="forgot-link" on:click|preventDefault={() => goto('/forgot-password')}>
        Forgot Password?
      </a>
    </div>

    <button type="submit" disabled={loading} class="submit-btn purple-btn">
      {loading ? 'Signing in...' : 'Login'}
    </button>

    <div class="register-section">
      <p class="register-text">Don't have an account?</p>
      <a href="/register" class="register-link" on:click|preventDefault={() => goto('/register')}>
        Create Account
      </a>
    </div>
  </form>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    overflow: hidden;
  }
  
  .login-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  }
  
  .login-form {
    background: white;
    border-radius: 16px;
    padding: 32px 28px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  
  .logo-section {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .infinity-symbol {
    font-size: 48px;
    margin: 0;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .title {
    font-size: 26px;
    font-weight: bold;
    margin: 8px 0 4px;
    color: #1f2937;
  }
  
  .subtitle {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
  }
  
  .input-group {
    position: relative;
    margin-bottom: 20px;
  }
  
  .input-group input {
    width: 100%;
    padding: 14px 70px 6px 14px;
    font-size: 15px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    background: white;
    transition: all 0.3s ease;
    outline: none;
    box-sizing: border-box;
  }
  
  .input-group input:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  .input-group label {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    transition: all 0.2s ease;
    pointer-events: none;
    font-size: 15px;
    background: white;
    padding: 0 2px;
  }
  
  .input-group input:focus + label,
  .input-group input:not(:placeholder-shown) + label {
    top: 6px;
    font-size: 11px;
    color: #8b5cf6;
  }
  
  .toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    padding: 6px 8px;
    color: #8b5cf6;
    border-radius: 6px;
  }
  
  .toggle-password:hover {
    background: #f3f4f6;
  }
  
  .alert {
    padding: 10px 12px;
    border-radius: 10px;
    margin-bottom: 18px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .alert.error {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }
  
  .options-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0 24px;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #4b5563;
    cursor: pointer;
  }
  
  .checkbox-label input {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #8b5cf6;
  }
  
  .forgot-link {
    color: #8b5cf6;
    text-decoration: none;
    font-size: 13px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .purple-btn {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
  }
  
  .purple-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
  
  .purple-btn:active {
    transform: translateY(0);
  }
  
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .register-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
  }
  
  .register-text {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
  }
  
  .register-link {
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
  }
  
  @media (max-width: 480px) {
    .login-form {
      padding: 24px 20px;
    }
    
    .title {
      font-size: 24px;
    }
    
    .input-group input {
      padding: 12px 65px 5px 12px;
      font-size: 14px;
    }
    
    .toggle-password {
      font-size: 12px;
      padding: 4px 6px;
    }
  }
</style>
