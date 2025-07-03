export default function AboutPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Über BookReviewer</h1>
        <p className="page-subtitle">Ihre moderne Plattform für Buchentdeckungen und -bewertungen</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>📚 Was ist BookReviewer?</h2>
          <p>
            BookReviewer ist eine moderne Web-Anwendung zum Entdecken, Bewerten und Verwalten 
            von Büchern. Durchsuchen Sie unsere Sammlung, lesen Sie Rezensionen anderer Nutzer 
            und teilen Sie Ihre eigenen Erfahrungen mit der Community.
          </p>
        </section>

        <section className="about-section">
          <h2>🚀 Technologie</h2>
          <p>
            Die Anwendung wurde mit diesen Web-Technologien entwickelt:
          </p>
          <ul className="tech-list">
            <li><strong>Next.js 15</strong> - React Framework mit Server Components</li>
            <li><strong>TypeScript</strong> - Typsicherheit und bessere Entwicklererfahrung</li>
            <li><strong>MongoDB</strong> - NoSQL-Datenbank mit Mongoose ODM</li>
            <li><strong>Docker</strong> - Containerisierte Entwicklung und Deployment</li>
            <li><strong>nginx</strong> - Reverse Proxy für optimale Performance</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>🎯 Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📖 Buchsammlung</h3>
              <p>Durchsuchen Sie unsere kuratierte Sammlung von Büchern verschiedener Genres</p>
            </div>
            <div className="feature-card">
              <h3>⭐ Bewertungen</h3>
              <p>Lesen und schreiben Sie authentische Rezensionen zu Ihren Lieblingsbüchern</p>
            </div>
            <div className="feature-card">
              <h3>🔍 Suche & Filter – tbd.</h3>
              <p>Finden Sie schnell Bücher nach Titel, Autor, Genre oder Bewertung</p>
            </div>
            <div className="feature-card">
              <h3>📱 Responsive Design</h3>
              <p>Optimiert für Desktop, Tablet und Mobile - überall verfügbar</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>🏫 Entstehung</h2>
          <p>
            Dieses Projekt entsteht im Rahmen des Moduls <strong>VS2025</strong> an der 
            <strong> HTW Berlin</strong>.
          </p>
          <p>
            Von einer einfachen serverseitigen Anwendung zu einer vollwertigen Full-Stack-Lösung 
            mit modernsten Web-Technologien. Ziel ist es, eine skalierbare und wartbare Architektur 
            zu schaffen, die zukünftige Erweiterungen ermöglicht.
          </p>
        </section>

        <section className="about-section">
          <h2>👩‍💻 Entwicklung</h2>
          <p>
            <strong>Version:</strong> 2.0 (Next.js Migration)<br/>
            <strong>Jahr:</strong> 2025<br/>
            <strong>Status:</strong> Aktive Entwicklung<br/>
          </p>
        </section>
      </div>
    </div>
  )
}
