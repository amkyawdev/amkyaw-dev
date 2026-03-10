<template>
  <div class="about-page">
    <div class="about-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="logo-large">
            <svg viewBox="0 0 100 100" class="logo-svg">
              <defs>
                <linearGradient id="aboutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#6366f1" />
                  <stop offset="50%" style="stop-color:#8b5cf6" />
                  <stop offset="100%" style="stop-color:#ec4899" />
                </linearGradient>
              </defs>
              <path d="M50 10 C20 10 10 35 10 50 C10 80 35 90 50 90 C65 90 90 80 90 50 C90 35 80 10 50 10" fill="url(#aboutGradient)" />
              <text x="50" y="58" text-anchor="middle" fill="white" font-size="35" font-weight="bold">A</text>
            </svg>
          </div>
          <h1 class="gradient-text">Amkyaw.Dev</h1>
          <p class="tagline">Connect. Share. Belong.</p>
          <div class="hero-stats">
            <div class="stat">
              <span class="value">10K+</span>
              <span class="label">Users</span>
            </div>
            <div class="stat">
              <span class="value">500+</span>
              <span class="label">Groups</span>
            </div>
            <div class="stat">
              <span class="value">50K+</span>
              <span class="label">Posts</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2>Features</h2>
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card card">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="team-section">
        <h2>Our Team</h2>
        <div class="team-grid">
          <div v-for="member in team" :key="member.name" class="team-card card">
            <img :src="member.avatar" :alt="member.name" />
            <h3>{{ member.name }}</h3>
            <p class="role">{{ member.role }}</p>
            <div class="social-links">
              <a href="#"><i class="i-carbon-logo-github"></i></a>
              <a href="#"><i class="i-carbon-logo-twitter"></i></a>
              <a href="#"><i class="i-carbon-email"></i></a>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="contact-section">
        <h2>Get In Touch</h2>
        <div class="contact-card card">
          <p>Have questions or suggestions? We'd love to hear from you!</p>
          <div class="contact-links">
            <a href="mailto:contact@amkyaw.dev" class="contact-link">
              <i class="i-carbon-email"></i>
              contact@amkyaw.dev
            </a>
            <a href="#" class="contact-link">
              <i class="i-carbon-logo-github"></i>
              github.com/amkyawdev
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="about-footer">
        <p>&copy; 2026 Amkyaw.Dev. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <router-link to="/">Home</router-link>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
const features = [
  { icon: 'i-carbon-user-multiple', title: 'Social Network', description: 'Connect with friends and make new connections from around the world.' },
  { icon: 'i-carbon-chat', title: 'Real-time Chat', description: 'Instant messaging with your friends and group members.' },
  { icon: 'i-carbon-user-multiple', title: 'Voice Groups', description: 'Join voice chat rooms with pyramid-style seating and leadership.' },
  { icon: 'i-carbon-document', title: 'Posts & Media', description: 'Share photos, videos, and thoughts with your followers.' },
  { icon: 'i-carbon-settings', title: 'Customization', description: 'Personalize your profile and settings to make it yours.' },
  { icon: 'i-carbon-security', title: 'Privacy First', description: 'Your data is secure with our advanced privacy features.' }
]

const team = [
  { name: 'Aung Myat', role: 'Founder & Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aung' },
  { name: 'Ko Ko', role: 'Backend Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=koko' },
  { name: 'Min Min', role: 'UI/UX Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=min' }
]
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  padding-bottom: 2rem;
}

.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Hero Section */
.hero-section {
  padding: 4rem 0;
  text-align: center;
}

.logo-large {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  animation: float 3s ease-in-out infinite;
}

.logo-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 30px rgba(99, 102, 241, 0.5));
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.tagline {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.hero-stats .stat {
  text-align: center;
}

.hero-stats .value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.hero-stats .label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Features Section */
.features-section {
  padding: 3rem 0;
}

.features-section h2,
.team-section h2,
.contact-section h2 {
  font-size: 2rem;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.feature-card h3 {
  color: white;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

/* Team Section */
.team-section {
  padding: 3rem 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.team-card {
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
}

.team-card:hover {
  transform: translateY(-8px);
}

.team-card img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid var(--primary);
}

.team-card h3 {
  color: white;
  margin-bottom: 0.25rem;
}

.team-card .role {
  color: var(--primary);
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-links a {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.social-links a:hover {
  background: var(--primary);
}

/* Contact Section */
.contact-section {
  padding: 3rem 0;
}

.contact-card {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
}

.contact-card p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  transition: all 0.2s;
}

.contact-link:hover {
  background: var(--primary);
}

/* Footer */
.about-footer {
  padding: 2rem 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 2rem;
}

.about-footer p {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}

.footer-links a:hover {
  color: var(--primary);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 0;
  }
  
  .logo-large {
    width: 80px;
    height: 80px;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .hero-stats {
    gap: 1.5rem;
  }
  
  .hero-stats .value {
    font-size: 1.5rem;
  }
}
</style>
