<script lang="ts">
  import { goto } from '$app/navigation';
  
  let email = '';
  let loading = false;
  let error = '';
  let success = false;
  
  const apiUrl = 'https://your-api-url.com';
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    
    try {
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      
      success = true;
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to send reset email';
    } finally {
      loading = false;
    }
  }
</script>

<div class="forgot-container">
  <div class="forgot-card">
    <button class="back-btn" on:click={() => goto('/login')}>← Back to Login</button>
    
    <div class="logo-section">
      <h1 class="infinity-symbol">∞</h1>
      <h2 class="title">Forgot Password?</h2>
      <p class="subtitle">No worries! Enter your email and we'll send you reset instructions.</p>
    </div>
    
    {#if success}
      <div class="alert success">
        <span>✅</span> 
        <div>
          <strong>Check your email!</strong><br>
          We've sent password reset instructions to <strong>{email}</strong>
        </div>
      </div>
      <button class="submit-btn purple-btn" on:click={() => goto('/login')}>
        Return to Login
      </button>
    {:else}
      {#if error}
        <div class="alert error">
          <span>⚠️</span> {error}
        </div>
      {/if}
      
      <form on:submit={handleSubmit}>
        <div class="input-group">
          <input
            type="email"
            placeholder=" "
            bind:value={email}
            required
          />
          <label>Email Address</label>
        </div>
        
        <button type="submit" disabled={loading} class="submit-btn purple-btn">
          {loading ? 'Sending...' : 'Send Reset Instructions'}
        </button>
      </form>
      
      <div class="help-text">
        <p>Remember your password? <a href="/login" on:click|preventDefault={() => goto('/login')}>Back to Login</a></p>
      </div>
    {/if}
  </div>
</div>

<style>
  .forgot-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  }
  
  .forgot-card {
    background: white;
    border-radius: 20px;
    padding: 40px 32px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  
  .back-btn {
    background: none;
    border: none;
    color: #8b5cf6;
    font-size: 14px;
    cursor: pointer;
    padding: 0;
    margin-bottom: 32px;
    display: inline-block;
  }
  
  .back-btn:hover {
    text-decoration: underline;
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
    font-size: 28px;
    font-weight: bold;
    margin: 8px 0 8px;
    color: #1f2937;
  }
  
  .subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }
  
  .alert {
    padding: 14px;
    border-radius: 12px;
    margin-bottom: 24px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
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
  
  .input-group {
    position: relative;
    margin-bottom: 28px;
  }
  
  .input-group input {
    width: 100%;
    padding: 14px 14px 6px 14px;
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
  
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .help-text {
    text-align: center;
    margin-top: 24px;
    font-size: 13px;
    color: #6b7280;
  }
  
  .help-text a {
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 600;
  }
  
  .help-text a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    .forgot-card {
      padding: 28px 20px;
    }
    
    .title {
      font-size: 24px;
    }
    
    .subtitle {
      font-size: 13px;
    }
  }
</style>
