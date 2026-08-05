"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KelebekLogo from "./components/KelebekLogo";
import LuxuryParticles from "./components/LuxuryParticles";
import AboutUs from "./components/AboutUs";
import BranchLocations from "./components/BranchLocations";
import { API_BASE } from "../lib/api";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", budget: "", requirement: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [portfolioList, setPortfolioList] = useState<any[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);

    fetch(`${API_BASE}/settings`)
      .then((r) => r.json())
      .then((d) => setSiteSettings(d))
      .catch(() => {});

    fetch(`${API_BASE}/portfolio`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setPortfolioList(d);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "New" }),
      });
      if (res.ok) {
        setFormStatus("sent");
        setFormData({ name: "", email: "", phone: "", budget: "", requirement: "" });
      } else setFormStatus("error");
    } catch {
      setFormStatus("error");
    }
    setTimeout(() => setFormStatus("idle"), 5000);
  };

  const portfolioItems = [
    { id: 1, key: "portfolio_1_img", category: "Residential", name: "Kelebek Royal Villa Sanctuary", budget: "₹15 Lakhs – ₹30 Lakhs", fallback: "/images/hero_interior_1784468037551.png" },
    { id: 2, key: "portfolio_2_img", category: "Commercial", name: "Solas Corporate Office & Lounge", budget: "₹35 Lakhs+", fallback: "/images/portfolio_commercial_1784468061607.png" },
    { id: 3, key: "portfolio_3_img", category: "Modular Kitchen", name: "Bespoke German Culinary Kitchen", budget: "₹5 Lakhs – ₹12 Lakhs", fallback: "/images/portfolio_kitchen_1784468083139.png" },
    { id: 4, key: "portfolio_4_img", category: "Residential", name: "Grand Sky Penthouse Suite", budget: "₹25 Lakhs – ₹45 Lakhs", fallback: "/images/portfolio_penthouse_1784468094816.png" },
    { id: 5, key: "portfolio_5_img", category: "Commercial", name: "Velour Designer Boutique", budget: "₹10 Lakhs – ₹20 Lakhs", fallback: "/images/portfolio_boutique_1784468107370.png" },
  ];

  const filters = ["All", "Residential", "Commercial", "Modular Kitchen"];

  const services = [
    { key: "service_1_img", fallback: "/images/portfolio_residential_1784468049217.png", title: "Luxury Residential Interiors", desc: "Bespoke home interiors crafted specifically around your lifestyle.", num: "01" },
    { key: "service_2_img", fallback: "/images/portfolio_commercial_1784468061607.png", title: "Commercial & Office Spaces", desc: "Crafting modern, inspiring corporate environments & retail stores.", num: "02" },
    { key: "service_3_img", fallback: "/images/hero_interior_1784468037551.png", title: "3D Visualization & Architectural Renders", desc: "Photorealistic 3D spatial renders and virtual walkthroughs.", num: "03" },
    { key: "service_4_img", fallback: "/images/portfolio_kitchen_1784468083139.png", title: "Modular Kitchen & Wardrobes", desc: "Custom acrylic, veneer & lacquer finishes with smart fittings.", num: "04" },
    { key: "service_5_img", fallback: "/images/portfolio_penthouse_1784468094816.png", title: "Furniture & FF&E Styling", desc: "Hand-curated furniture, brass accents, & bespoke lighting.", num: "05" },
    { key: "service_6_img", fallback: "/images/portfolio_boutique_1784468107370.png", title: "Turnkey Interior Execution", desc: "End-to-end site management from civil work to final handover.", num: "06" },
  ];

  const displayPortfolio =
    portfolioList.length > 0
      ? portfolioList.map((item) => ({
          id: item.id,
          category: item.category,
          name: item.title,
          budget: item.budget_range || "",
          img: item.after_image_url || "/images/hero_interior_1784468037551.png",
        }))
      : portfolioItems.map((item) => ({
          id: item.id,
          category: item.category,
          name: item.name,
          budget: item.budget,
          img: siteSettings[item.key] || item.fallback,
        }));

  const filteredPortfolio = displayPortfolio.filter((p) => activeFilter === "All" || p.category === activeFilter);

  const brandName = siteSettings.site_name || "KELEBEK DESIGNERS";

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="navbar-inner" style={{ height: "80px" }}>
            <a href="#" className="navbar-logo" onClick={closeMenu} style={{ display: "flex", alignItems: "center" }}>
              <KelebekLogo variant="horizontal" height={42} />
            </a>

            {/* Desktop links */}
            <ul className="navbar-links">
              {["#services", "#portfolio", "#about", "#contact"].map((href, i) => (
                <li key={i}>
                  <a href={href}>{["Services", "Portfolio", "Studio", "Contact"][i]}</a>
                </li>
              ))}
              <li>
                <a href="/portfolio">Full Gallery</a>
              </li>
            </ul>

            <div className="navbar-right">
              <a href="#contact" className="btn-primary navbar-cta-btn">
                Book Consultation
              </a>
              {/* Hamburger */}
              <button
                className={`hamburger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {[
                ["#services", "Services"],
                ["#portfolio", "Portfolio"],
                ["#about", "Studio"],
                ["#contact", "Contact"],
                ["/portfolio", "Full Gallery"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="mobile-link" onClick={closeMenu}>
                  {label}
                </a>
              ))}
              <a href="#contact" className="mobile-cta" onClick={closeMenu}>
                Book Consultation →
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="hero">

        {/* Background image & 3D ambient snow/particle canvas */}
        <div className="hero-bg">
          <img
            src={siteSettings.hero_bg_img || "/images/hero_interior_1784468037551.png"}
            alt="Kelebek Designers – Luxury Interior"
            className="hero-bg-img"
          />
          <LuxuryParticles />
          <div className="hero-overlay" />
        </div>

        {/* Decorative vertical gold line (desktop only) */}
        <div className="hero-deco-line" />

        {/* Main content — sits at bottom-left */}
        <div className="hero-body">
          <div className="container">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                className="label hero-label"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                ✦ &nbsp; Premium Interior Design Studio &nbsp; ✦
              </motion.div>

              <motion.h1
                className="display-xl hero-headline"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 }}
              >
                Spaces Designed<br />
                <em className="hero-headline-em">to Inspire.</em>
              </motion.h1>

              <motion.p
                className="body-lg hero-sub"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 }}
              >
                KELEBEK DESIGNERS crafts bespoke luxury interiors across Tamil Nadu &amp; beyond —
                blending heritage aesthetics with contemporary elegance.
              </motion.p>

              <motion.div
                className="hero-ctas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.72 }}
              >
                <a href="#contact" className="hero-btn-primary">Book Free Consultation</a>
                <a href="#portfolio" className="hero-btn-outline">View Our Work →</a>
              </motion.div>

              <motion.div
                className="hero-stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                {[
                  { value: "250+", label: "Projects Delivered" },
                  { value: "12+", label: "Years of Excellence" },
                  { value: "₹500Cr+", label: "Design Value Executed" },
                ].map((stat, i) => (
                  <div className="hero-stat" key={i}>
                    <span className="hero-stat-value">{stat.value}</span>
                    <span className="hero-stat-label">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator — pinned to bottom-right */}
        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="hero-scroll-line" />
          <span className="hero-scroll-text">Scroll</span>
        </motion.div>

      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="section services">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-header-text">
              <div className="label">Our Design Specialties</div>
              <div className="gold-line" />
              <h2 className="display-md">
                Crafting Spaces That<br />
                <em>Exude Distinction</em>
              </h2>
            </div>
            <a href="#contact" className="btn-gold-outline section-header-cta">
              All Services
            </a>
          </motion.div>

          <div className="services-grid">
            {services.map((s, i) => (
              <motion.div
                className="service-card"
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <img src={siteSettings[s.key] || s.fallback} alt={s.title} className="service-bg" />
                <div className="service-overlay" />
                <div className="service-body">
                  <div className="service-number">{s.num}</div>
                  <h3 className="service-title">{s.title}</h3>
                  <p className="service-desc">{s.desc}</p>
                  <a href="#contact" className="service-arrow">
                    Consult Us →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="portfolio" className="section portfolio">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-header-text">
              <div className="label">Selected Works</div>
              <div className="gold-line" />
              <h2 className="display-md">
                Portfolio of <br />
                <em>Refined Interiors</em>
              </h2>
            </div>
            <div className="portfolio-filter">
              {filters.map((f) => (
                <button key={f} className={activeFilter === f ? "active" : ""} onClick={() => setActiveFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="portfolio-grid">
            {filteredPortfolio.map((item, idx) => (
              <motion.div
                key={item.id}
                className={`portfolio-item ${idx === 0 && activeFilter === "All" ? "featured" : ""}`}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <img src={item.img} alt={item.name} className="portfolio-img" />
                <div className="portfolio-overlay">
                  <div className="portfolio-category">{item.category}</div>
                  <div className="portfolio-name">{item.name}</div>
                  <div className="portfolio-budget">{item.budget}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AboutUs />

      <BranchLocations />

      {/* ── CONTACT & CONSULTATION BOOKING ── */}
      <section id="contact" className="section cta-section">
        <div className="container">
          <div className="cta-grid">
            <motion.div
              className="cta-content"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="label">Begin Your Transformation</div>
              <div className="gold-line" />
              <h2 className="display-md cta-heading">
                Let&apos;s Craft Your <br />
                <em>Sanctuary Space</em>
              </h2>
              <p className="body-lg">
                Every extraordinary interior begins with a visionary discussion. Submit your project requirements to Kelebek Designers below.
              </p>
              <ul className="cta-features">
                <li>
                  <span className="feature-dot" />
                  Free initial architectural &amp; design discovery session
                </li>
                <li>
                  <span className="feature-dot" />
                  Tailored budget breakdown &amp; material mood board presentation
                </li>
                <li>
                  <span className="feature-dot" />
                  Dedicated Senior Interior Architect for your project
                </li>
              </ul>
              {(siteSettings.contact_email || siteSettings.contact_phone || siteSettings.office_address) && (
                <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(201,169,110,0.2)", paddingTop: "1.5rem", display: "grid", gap: "0.7rem" }}>
                  {siteSettings.contact_phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", fontSize: "0.9rem" }}>
                      <span style={{ color: "var(--gold)" }}>📞</span>
                      <a href={`tel:${siteSettings.contact_phone}`} style={{ color: "var(--text-secondary)" }}>
                        {siteSettings.contact_phone}
                      </a>
                    </div>
                  )}
                  {siteSettings.contact_email && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", fontSize: "0.9rem" }}>
                      <span style={{ color: "var(--gold)" }}>✉</span>
                      <a href={`mailto:${siteSettings.contact_email}`} style={{ color: "var(--text-secondary)" }}>
                        {siteSettings.contact_email}
                      </a>
                    </div>
                  )}
                  {siteSettings.office_address && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem", fontSize: "0.9rem" }}>
                      <span style={{ color: "var(--gold)" }}>📍</span>
                      <span style={{ color: "var(--text-secondary)", whiteSpace: "pre-line" }}>{siteSettings.office_address}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div
              className="cta-form"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="form-title">Request Design Consultation</h3>
              <p className="form-subtitle">Fill in your contact details and our design team will contact you promptly.</p>

              {formStatus === "sent" ? (
                <div className="form-success">
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✦</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--white)", marginBottom: "0.5rem" }}>
                    Thank You for Choosing Kelebek Designers
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Your inquiry has been logged. Our design studio team will contact you shortly.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} id="lead-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input id="name" name="name" type="text" placeholder="Your Full Name" value={formData.name} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" name="email" type="email" placeholder="name@domain.com" value={formData.email} onChange={handleFormChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Mobile / WhatsApp Number (+91) *</label>
                      <input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="budget">Target Budget (INR ₹)</label>
                      <input
                        id="budget"
                        name="budget"
                        type="text"
                        placeholder="e.g. ₹15 Lakhs or 15L"
                        value={formData.budget}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="requirement">Project Requirements &amp; City Location</label>
                    <textarea
                      id="requirement"
                      name="requirement"
                      rows={4}
                      placeholder="Specify your city, floor plan size (e.g. 3BHK 1800 sqft), design style, and target timeline..."
                      value={formData.requirement}
                      onChange={handleFormChange}
                    />
                  </div>
                  <button type="submit" className="form-submit" disabled={formStatus === "sending"}>
                    {formStatus === "sending" ? "Submitting Inquiry..." : "Submit Consultation Request →"}
                  </button>
                  {formStatus === "error" && <p className="form-error">Something went wrong. Please check your connection and try again.</p>}
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <KelebekLogo variant="horizontal" height={50} />
              <p className="footer-desc" style={{ marginTop: "1rem" }}>
                Premier luxury interior design studio specializing in bespoke residential, commercial, and modular space transformations across India.
              </p>
            </div>
            <div className="footer-col">
              <h4>Specialties</h4>
              <ul>
                <li>
                  <a href="#services">Residential Interior Design</a>
                </li>
                <li>
                  <a href="#services">Commercial &amp; Corporate Spaces</a>
                </li>
                <li>
                  <a href="#services">Modular Kitchens &amp; Wardrobes</a>
                </li>
                <li>
                  <a href="#portfolio">Full Project Gallery</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Kelebek Studio</h4>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.8, display: "grid", gap: "0.4rem" }}>
                {siteSettings.office_address ? (
                  <span style={{ whiteSpace: "pre-line" }}>{siteSettings.office_address}</span>
                ) : (
                  <span>
                    KELEBEK DESIGNERS STUDIO
                    <br />
                    Interior Design &amp; Architectural Spaces, India
                  </span>
                )}
                {siteSettings.contact_phone ? (
                  <a href={`tel:${siteSettings.contact_phone}`} style={{ color: "var(--gold)" }}>
                    {siteSettings.contact_phone}
                  </a>
                ) : (
                  <span style={{ color: "var(--gold)" }}>+91 98765 43210</span>
                )}
                {siteSettings.contact_email && (
                  <a href={`mailto:${siteSettings.contact_email}`} style={{ color: "var(--gold)" }}>
                    {siteSettings.contact_email}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} {brandName} — Interior Design &amp; Spaces. All rights reserved.
              <a href="/admin" style={{ color: "rgba(255,255,255,0.15)", marginLeft: "20px" }}>
                Manage Website (Admin)
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
