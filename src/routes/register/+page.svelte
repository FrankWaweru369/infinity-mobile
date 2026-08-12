<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/services/api';
  import { saveSession } from '$lib/services/session';
  
  let form = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  let loading = false;
  let error = '';
  let success = '';
  let showPassword = false;
  let showConfirmPassword = false;
  let passwordsMatch = true;
  let acceptedTerms = false;
  
  function handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    form = { ...form, [input.name]: input.value };
    
    if (form.password && form.confirmPassword) {
      passwordsMatch = form.password === form.confirmPassword;
    } else {
      passwordsMatch = true;
    }
  }
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!acceptedTerms) {
      error = 'You must accept the Terms and Conditions';
      return;
    }
    
    if (!passwordsMatch) {
      error = 'Passwords do not match';
      return;
    }
    
    if (form.password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }
    
    loading = true;
    error = '';
    success = '';
    
    try {
      const data = await auth.register({
        username: form.username,
        email: form.email,
        password: form.password
      });
      
      // Store token if returned
      if (data.accessToken && data.refreshToken) {
  saveSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user
  });
} else {
  throw new Error('Registration successful but session could not be created');
}
      
      success = 'Registration successful! Redirecting...';
      setTimeout(() => {
        goto('/dashboard');
      }, 2000);
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Something went wrong';
    } finally {
      loading = false;
    }
  }
</script>

<!-- Rest of your register page HTML stays exactly the same -->
<div class="register-container">
  <form on:submit={handleSubmit} class="register-form">
    <div class="logo-section">
      <h1 class="infinity-symbol">∞</h1>
      <h2 class="title">Create Account</h2>
      <p class="subtitle">Join Infinity to share your world</p>
    </div>

    {#if error}
      <div class="alert error">
        <span>⚠️</span> {error}
      </div>
    {/if}

    {#if success}
      <div class="alert success">
        <span>✅</span> {success}
      </div>
    {/if}

    <div class="input-group">
      <input
        type="text"
        name="username"
        placeholder=" "
        value={form.username}
        on:input={handleChange}
        required
      />
      <label>Username</label>
    </div>

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

    <div class="input-group">
      <input
        type={showConfirmPassword ? 'text' : 'password'}
        name="confirmPassword"
        placeholder=" "
        value={form.confirmPassword}
        on:input={handleChange}
        required
        class:error-input={!passwordsMatch && form.confirmPassword.length > 0}
      />
      <label>Confirm Password</label>
      <button
        type="button"
        class="toggle-password"
        on:click={() => showConfirmPassword = !showConfirmPassword}
      >
        {showConfirmPassword ? 'Hide' : 'Show'}
      </button>
    </div>

    {#if !passwordsMatch && form.confirmPassword.length > 0}
      <p class="password-error">✗ Passwords do not match</p>
    {:else if form.password.length > 0 && form.password.length < 6}
      <p class="password-error">✗ Password must be at least 6 characters</p>
    {:else if form.password.length >= 6 && !passwordsMatch}
      <p class="password-error">✗ Passwords do not match</p>
    {:else if form.password.length >= 6 && passwordsMatch && form.confirmPassword.length > 0}
      <p class="password-success">✓ Passwords match</p>
    {/if}

    <div class="terms-group">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          bind:checked={acceptedTerms}
        />
        <span>I accept the <a href="/terms" target="_blank">Terms</a> and <a href="/privacy" target="_blank">Privacy Policy</a></span>
      </label>
    </div>

    <button type="submit" disabled={loading} class="submit-btn purple-btn">
      {loading ? 'Creating account...' : 'Register'}
    </button>

    <div class="login-section">
      <p class="login-text">Already have an account?</p>
      <a href="/login" class="login-link" on:click|preventDefault={() => goto('/login')}>
        Login
      </a>
    </div>

    <div class="forgot-password">
      <a href="/forgot-password" on:click|preventDefault={() => goto('/forgot-password')}>
        Forgot Password?
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
  
  .register-container {
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
  
  .register-form {
    background: white;
    border-radius: 16px;
    padding: 32px 28px;
    width: 100%;
    max-width: 420px;
    margin: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  
  .logo-section {
    text-align: center;
    margin-bottom: 28px;
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
  
  .input-group input.error-input {
    border-color: #ef4444;
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
    background: transparent;
    padding: 0 2px;
  }
  
  .input-group input:focus + label,
  .input-group input:not(:placeholder-shown) + label {
    top: 6px;
    font-size: 11px;
    color: #8b5cf6;
    background: white;
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
  
  .alert.success {
    background: #dcfce7;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }
  
  .password-error {
    color: #dc2626;
    font-size: 11px;
    margin: -14px 0 14px 0;
    padding-left: 8px;
  }
  
  .password-success {
    color: #16a34a;
    font-size: 11px;
    margin: -14px 0 14px 0;
    padding-left: 8px;
  }
  
  .terms-group {
    margin: 20px 0 18px;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #4b5563;
    cursor: pointer;
  }
  
  .checkbox-label input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #8b5cf6;
  }
  
  .checkbox-label a {
    color: #8b5cf6;
    text-decoration: none;
  }
  
  .checkbox-label a:hover {
    text-decoration: underline;
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
    transform: none;
  }
  
  .login-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    margin-bottom: 12px;
  }
  
  .login-text {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
  }
  
  .login-link {
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
  }
  
  .login-link:hover {
    text-decoration: underline;
  }
  
  .forgot-password {
    text-align: center;
  }
  
  .forgot-password a {
    color: #9ca3af;
    text-decoration: none;
    font-size: 12px;
  }
  
  .forgot-password a:hover {
    color: #8b5cf6;
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    .register-form {
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
