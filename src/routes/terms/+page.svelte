<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<div class="terms-container">
  <div class="terms-card">
    <div class="header">
      <button class="back-btn" on:click={() => goto('/register')}>← Back</button>
      <div class="logo-section">
        <h1 class="infinity-symbol">∞</h1>
        <h1 class="title">Terms & Conditions</h1>
        <p class="subtitle">Please read carefully before registering</p>
      </div>
    </div>
    
    <div class="terms-content">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>By creating an account on Infinity, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our service.</p>
      </section>
      
      <section>
        <h2>2. User Conduct</h2>
        <p>You agree to:</p>
        <ul>
          <li>Post only content that belongs to you or you have permission to share</li>
          <li>Not harass, abuse, or harm other users</li>
          <li>Not post illegal, offensive, or inappropriate content</li>
          <li>Respect intellectual property rights of others</li>
        </ul>
      </section>
      
      <section>
        <h2>3. Privacy</h2>
        <p>Your privacy is important. Please review our Privacy Policy to understand how we collect and use your information.</p>
      </section>
      
      <section>
        <h2>4. Content Ownership</h2>
        <p>You retain ownership of content you post. By posting, you grant Infinity a license to display and share your content within the platform.</p>
      </section>
      
      <section>
        <h2>5. Account Security</h2>
        <p>You are responsible for maintaining the security of your account. Notify us immediately of any unauthorized access.</p>
      </section>
      
      <section>
        <h2>6. Termination</h2>
        <p>We reserve the right to suspend or terminate accounts that violate these terms or for any other reason at our discretion.</p>
      </section>
      
      <section>
        <h2>7. Changes to Terms</h2>
        <p>We may update these terms from time to time. Continued use of the platform constitutes acceptance of updated terms.</p>
      </section>
      
      <section>
        <h2>8. Contact</h2>
        <p>Questions? Contact us at: <a href="mailto:infinitysupport19@gmail.com">infinitysupport19@gmail.com</a></p>
      </section>

      <section>
        <h2>9. Privacy Policy</h2>
        <p>Please review our <a href="/privacy" on:click|preventDefault={() => goto('/privacy')}>Privacy Policy</a> to understand how we handle your data.</p>
      </section>
    </div>

    
    <div class="footer">
      <button class="accept-btn purple-btn" on:click={() => goto('/register')}>
        I Accept the Terms
      </button>
    </div>
  </div>
</div>

<style>
  .terms-container {
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  }
  
  .terms-card {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  
  .header {
    margin-bottom: 32px;
  }
  
  .back-btn {
    background: none;
    border: none;
    color: #8b5cf6;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 0;
    margin-bottom: 20px;
  }
  
  .back-btn:hover {
    text-decoration: underline;
  }
  
  .logo-section {
    text-align: center;
    margin-bottom: 20px;
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
    font-size: 32px;
    font-weight: bold;
    margin: 8px 0 4px;
    color: #1f2937;
  }
  
  .subtitle {
    font-size: 14px;
    color: #6b7280;
  }
  
  .terms-content {
    margin: 32px 0;
  }
  
  section {
    margin-bottom: 28px;
  }
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 14px;
    line-height: 1.6;
    color: #4b5563;
    margin-bottom: 12px;
  }
  
  ul {
    margin: 8px 0 0 20px;
    padding-left: 0;
  }
  
  li {
    font-size: 14px;
    line-height: 1.6;
    color: #4b5563;
    margin-bottom: 6px;
  }
  
  a {
    color: #8b5cf6;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  .footer {
    text-align: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
  }
  
  .accept-btn {
    padding: 12px 32px;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
  }
  
  .purple-btn {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
  }
  
  .purple-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
  
  @media (max-width: 640px) {
    .terms-card {
      padding: 24px 20px;
    }
    
    .title {
      font-size: 26px;
    }
    
    h2 {
      font-size: 16px;
    }
  }
</style>
