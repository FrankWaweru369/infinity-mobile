<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<div class="privacy-container">
  <div class="privacy-card">
    <button class="back-btn" on:click={() => goto('/register')}>← Back</button>
    
    <div class="logo-section">
      <h1 class="infinity-symbol">∞</h1>
      <h1 class="title">Privacy Policy</h1>
      <p class="subtitle">Last updated: April 13, 2026</p>
    </div>
    
    <div class="privacy-content">
      <section>
        <h2>Information We Collect</h2>
        <p><strong>Account Information:</strong> When you register, we collect your username, email address, and encrypted password.</p>
        <p><strong>Content You Post:</strong> Photos, text posts, comments, and likes you share on Infinity.</p>
        <p><strong>Device Information:</strong> App version, device type, and operating system to improve performance.</p>
      </section>
      
      <section>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To display your feed and posts from other users</li>
          <li>To enable interactions (likes, comments, follows)</li>
          <li>To improve app performance and fix bugs</li>
          <li>To send important notifications about your account</li>
        </ul>
      </section>
      
      <section>
        <h2>Data Storage & Security</h2>
        <p>Your data is stored securely on our servers. We use industry-standard encryption to protect your password and personal information. However, no method of transmission over the internet is 100% secure.</p>
      </section>
      
      <section>
        <h2>Third-Party Services</h2>
        <p>We do not sell your personal information. We may use trusted third-party services (cloud hosting, email delivery) that have their own privacy policies.</p>
      </section>
      
      <section>
        <h2>Your Rights & Control</h2>
        <ul>
          <li><strong>Delete content:</strong> You can delete your posts, comments, or entire account at any time</li>
          <li><strong>Edit profile:</strong> Update your username and profile information</li>
          <li><strong>Download data:</strong> Request a copy of your data (coming soon)</li>
        </ul>
      </section>
      
      <section>
        <h2>Children's Privacy</h2>
        <p>Infinity is not intended for users under 13 years old. We do not knowingly collect information from children under 13.</p>
      </section>
      
      <section>
        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Continued use of Infinity after changes means you accept the updated policy.</p>
      </section>
      
      <section>
        <h2>Contact Us</h2>
        <p>Questions about this Privacy Policy? Contact us at: <a href="mailto:infinitysupport19@gmail.com">infinitysupport19@gmail.com</a></p>
      </section>
    </div>
    
    <div class="footer">
      <button class="accept-btn purple-btn" on:click={() => goto('/register')}>
        I Understand
      </button>
    </div>
  </div>
</div>

<style>
  .privacy-container {
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  }
  
  .privacy-card {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
    font-size: 32px;
    font-weight: bold;
    margin: 8px 0 4px;
    color: #1f2937;
  }
  
  .subtitle {
    font-size: 14px;
    color: #6b7280;
  }
  
  .privacy-content {
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
    margin-bottom: 10px;
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
    .privacy-card {
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
