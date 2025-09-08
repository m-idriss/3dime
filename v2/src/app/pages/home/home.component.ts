import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="home-page">
      <!-- Profile Section -->
      <section class="profile-section glass-card">
        <div class="profile-header">
          <img src="logo.png" alt="3dime Logo" class="profile-logo">
          <h1 class="profile-name">✨ Idriss ✨</h1>
        </div>
        <div class="social-links">
          <a href="https://github.com/m-idriss" target="_blank" class="social-link" aria-label="GitHub">
            <span class="social-icon">🔗</span>
          </a>
          <a href="https://www.linkedin.com/in/i-mohamady/" target="_blank" class="social-link" aria-label="LinkedIn">
            <span class="social-icon">💼</span>
          </a>
          <a href="https://x.com/3dime13" target="_blank" class="social-link" aria-label="Twitter">
            <span class="social-icon">🐦</span>
          </a>
          <a href="https://www.facebook.com/imohamady/" target="_blank" class="social-link" aria-label="Facebook">
            <span class="social-icon">📘</span>
          </a>
          <a href="https://www.instagram.com/3dime13/" target="_blank" class="social-link" aria-label="Instagram">
            <span class="social-icon">📸</span>
          </a>
        </div>
      </section>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- About Me -->
        <section class="content-card glass-card">
          <h2>About Me</h2>
          <p>Tech enthusiast and lifelong learner. French of Malagasy origin, living in Nice with my wife and children. I love building elegant solutions that keep things simple.</p>
        </section>

        <!-- Tech Stack -->
        <section class="content-card glass-card">
          <h2>Tech Stack</h2>
          <p>Some of the technologies I worked with.</p>
          <div class="tech-badges">
            <a href="https://www.java.com/" target="_blank" class="tech-badge">Java</a>
            <a href="https://quarkus.io/" target="_blank" class="tech-badge">Quarkus</a>
            <a href="https://spring.io/projects/spring-boot" target="_blank" class="tech-badge">Spring Boot</a>
            <a href="https://agilemanifesto.org/" target="_blank" class="tech-badge">Agile</a>
            <a href="https://www.docker.com/" target="_blank" class="tech-badge">Docker</a>
            <a href="https://www.postgresql.org/" target="_blank" class="tech-badge">PostgreSQL</a>
            <a href="https://www.mongodb.com/" target="_blank" class="tech-badge">MongoDB</a>
          </div>
        </section>

        <!-- GitHub Activity -->
        <section class="content-card glass-card">
          <h2>Github Activity</h2>
          <div class="github-activity">
            <p>📊 GitHub Activity visualization requires internet connection</p>
            <p>Visit <a href="https://github.com/m-idriss" target="_blank">github.com/m-idriss</a> to see activity</p>
          </div>
        </section>

        <!-- Experience & Projects -->
        <section class="content-card glass-card">
          <h2>Experience & Projects</h2>
          <p>Companies and projects I've contributed to.</p>
          <div class="project-links">
            <a href="https://amadeus.com/fr/compagnies-aeriennes/produit/airline-order-management" target="_blank" class="project-link">Amadeus Order Management System</a>
            <a href="https://astekgroup.fr/" target="_blank" class="project-link">Astek</a>
            <a href="https://www.oodrive.com/fr/produits/oodrive-sign/" target="_blank" class="project-link">Oodrive Sign</a>
            <a href="https://barberlarchitecte.com/" target="_blank" class="project-link">Barber L'Architecte</a>
            <a href="https://erese.fr/" target="_blank" class="project-link">Erese</a>
            <a href="https://www.univ-amu.fr/fr/public/plateformes-technologique-labellisees-de-linstitut" target="_blank" class="project-link">PFT Energies Propres</a>
            <a href="https://www.securitas.fr/" target="_blank" class="project-link">Eurotelis (Valiance, now Securitas)</a>
          </div>
        </section>

        <!-- Education & Training -->
        <section class="content-card glass-card">
          <h2>Education & Training</h2>
          <p>From Energy learning to IT retraining.</p>
          <div class="education-links">
            <a href="https://www.afpa.fr/centre/centre-de-marseille-st-jerome" target="_blank" class="education-link">AFPA St Jérôme (Software Dev)</a>
            <a href="https://www.brassart.fr/ecole/histoire#history" target="_blank" class="education-link">Aries Ecole Sup d'Infographie 3D</a>
            <a href="https://iut.univ-amu.fr/fr/formations/bachelor-universitaire-de-technologie/but-metiers-transition-efficacite-energetiques" target="_blank" class="education-link">IUT Aix-Marseille</a>
          </div>
        </section>

        <!-- Stuff -->
        <section class="content-card glass-card">
          <h2>Stuff</h2>
          <p>Stuff I use and recommend.</p>
          <div class="stuff-list">
            <a href="https://www.apple.com/macbook-pro/" target="_blank" class="stuff-item">Apple MacBook Pro 14</a>
            <a href="https://www.apple.com/iphone/" target="_blank" class="stuff-item">Apple iPhone</a>
            <a href="https://www.apple.com/airpods-pro/" target="_blank" class="stuff-item">Apple AirPods Pro</a>
            <a href="https://www.logitech.com/fr-fr/shop/p/mx-keys-mini" target="_blank" class="stuff-item">Logitech MX Keys Mini</a>
            <a href="https://fr.tineco.com/" target="_blank" class="stuff-item">Tineco Vacuum Cleaner</a>
            <a href="https://www.amazon.fr/Remington-Electrique-R%C3%A9sultat-Flexibles-Utilisation/dp/B09RNCQSJL/" target="_blank" class="stuff-item">Remington Electric Shaver for Bald</a>
            <a href="https://www.revolut.com/" target="_blank" class="stuff-item">Revolut</a>
          </div>
        </section>

        <!-- Hobbies & Interests -->
        <section class="content-card glass-card">
          <h2>Hobbies & Interests</h2>
          <p>Things I enjoy watching/doing.</p>
          <div class="hobbies-list">
            <a href="https://www.om.fr/" target="_blank" class="hobby-item">Olympique de Marseille</a>
            <a href="https://mangaplus.shueisha.co.jp/titles/700005" target="_blank" class="hobby-item">One Piece</a>
            <a href="https://www.instagram.com/chateaupizza/" target="_blank" class="hobby-item">Pizza</a>
            <a href="https://www.formula1.com/" target="_blank" class="hobby-item">F1</a>
            <a href="https://www.chess.com/member/idriss33345" target="_blank" class="hobby-item">Chess</a>
            <a href="https://www.ageofempires.com/games/aoe2de/" target="_blank" class="hobby-item">Age of Empires 2</a>
            <a href="https://www.solitaireparadise.com/" target="_blank" class="hobby-item">Scrabble</a>
            <a href="https://www.basic-fit.com/" target="_blank" class="hobby-item">Basic-Fit</a>
          </div>
        </section>

        <!-- Contact -->
        <section class="content-card glass-card contact-card">
          <a href="mailto:contact@3dime.com" class="contact-email">contact@3dime.com</a>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .home-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--space-6);
      position: relative;
    }

    .profile-section {
      margin-bottom: var(--space-8);
      text-align: center;
      padding: var(--space-8);
      background: rgba(26, 26, 26, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin: 0 auto var(--space-8);
      max-width: 400px;
    }

    .profile-header {
      margin-bottom: var(--space-6);
    }

    .profile-logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-bottom: var(--space-4);
      background: rgba(255, 255, 255, 0.1);
      padding: var(--space-2);
    }

    .profile-name {
      font-size: var(--font-size-2xl);
      color: var(--color-text-primary);
      margin: 0;
    }

    .social-links {
      display: flex;
      gap: var(--space-4);
      justify-content: center;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .social-icon {
      font-size: 18px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-8);
    }

    .content-card {
      background: rgba(26, 26, 26, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: var(--space-6);
      transition: all 0.3s ease;
    }

    .content-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .content-card h2 {
      color: var(--color-primary);
      font-size: var(--font-size-xl);
      margin-bottom: var(--space-4);
    }

    .content-card p {
      color: var(--color-text-secondary);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }

    .tech-badges, .project-links, .education-links, .stuff-list, .hobbies-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .tech-badge, .project-link, .education-link, .stuff-item, .hobby-item {
      background: rgba(0, 212, 170, 0.1);
      border: 1px solid rgba(0, 212, 170, 0.3);
      color: var(--color-text-primary);
      padding: var(--space-2) var(--space-3);
      text-decoration: none;
      font-size: var(--font-size-sm);
      transition: all 0.3s ease;
      display: inline-block;
    }

    .tech-badge:hover, .project-link:hover, .education-link:hover, .stuff-item:hover, .hobby-item:hover {
      background: rgba(0, 212, 170, 0.2);
      border-color: var(--color-primary);
      color: var(--color-primary);
      transform: translateY(-1px);
    }

    .github-activity {
      text-align: center;
      padding: var(--space-4);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .github-activity p {
      margin-bottom: var(--space-2);
    }

    .github-activity a {
      color: var(--color-primary);
      text-decoration: none;
    }

    .github-activity a:hover {
      text-decoration: underline;
    }

    .contact-card {
      text-align: center;
      grid-column: 1 / -1;
      max-width: 400px;
      margin: 0 auto;
    }

    .contact-email {
      font-size: var(--font-size-xl);
      color: var(--color-primary);
      text-decoration: none;
      display: block;
      padding: var(--space-4);
      background: rgba(0, 212, 170, 0.1);
      border: 1px solid rgba(0, 212, 170, 0.3);
      transition: all 0.3s ease;
    }

    .contact-email:hover {
      background: rgba(0, 212, 170, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 212, 170, 0.3);
    }

    /* Glass morphism effects */
    .glass-card {
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .home-page {
        padding: var(--space-4);
      }
      
      .content-grid {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }
      
      .profile-section {
        margin-bottom: var(--space-6);
        padding: var(--space-6);
      }
      
      .content-card {
        padding: var(--space-4);
      }
      
      .social-links {
        gap: var(--space-3);
      }
      
      .tech-badges, .project-links, .education-links, .stuff-list, .hobbies-list {
        gap: var(--space-1);
      }
    }
  `]
})
export class HomeComponent {

}