"use client";

import { motion } from "framer-motion";

const founderPhone = "+91 89403 55994";

export default function AboutUs() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about-grid about-grid-founder">
          <motion.div
            className="about-visual"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="about-image-wrapper founder-image-wrapper">
              <img src="/images/gopinath-g-founder.jpeg" alt="Gopinath G, Founder of Kelebek Designers" />
            </div>
            <div className="about-badge founder-badge">
              <div className="badge-number">KG</div>
              <div className="badge-text">Founder &amp; Principal Designer</div>
            </div>
          </motion.div>

          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="label">About Kelebek Designers</div>
            <div className="gold-line" />
            <h2 className="display-md about-heading">
              Design led by <br />
              <em>Gopinath G.</em>
            </h2>
            <p className="body-lg about-intro">
              Kelebek Designers is an interior design studio creating thoughtful residential and commercial spaces with a focus on functionality, material quality, and personal expression.
            </p>
            <p className="about-founder-copy">
              Founder Gopinath G brings a hands-on approach to every project, from the first design discussion through site execution and final styling.
            </p>

            <div className="about-contact-card" aria-label="Business contact details">
              <div className="about-contact-item">
                <span className="about-contact-label">Founder</span>
                <strong>Gopinath G</strong>
              </div>
              <div className="about-contact-item">
                <span className="about-contact-label">Call / WhatsApp</span>
                <a href="tel:+918940355994">{founderPhone}</a>
              </div>
              <div className="about-contact-item about-registration">
                <span className="about-contact-label">Business registration</span>
                <span>Registration details available on request</span>
              </div>
            </div>

            <div className="about-actions">
              <a href={`https://wa.me/918940355994`} target="_blank" rel="noreferrer" className="btn-primary">
                <span>Chat on WhatsApp</span>
              </a>
              <a href="#contact" className="btn-gold-outline">Book a Consultation</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
