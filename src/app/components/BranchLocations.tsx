"use client";

import { motion } from "framer-motion";

const branches = [
  { name: "Coimbatore Studio", location: "Coimbatore, Tamil Nadu", description: "Consultations and interior design planning for Coimbatore and surrounding areas.", mapQuery: "Coimbatore, Tamil Nadu, India" },
  { name: "Bhuvanagiri Studio", location: "Bhuvanagiri, Cuddalore, Tamil Nadu", description: "Serving Bhuvanagiri, Cuddalore, and nearby communities with tailored design solutions.", mapQuery: "Bhuvanagiri, Cuddalore, Tamil Nadu, India" },
];

export default function BranchLocations() {
  return (
    <section id="locations" className="section locations-section">
      <div className="container">
        <motion.div className="locations-heading" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div>
            <div className="label">Visit Our Studios</div>
            <div className="gold-line" />
            <h2 className="display-md">Design support, <em>closer to you.</em></h2>
          </div>
          <p>Choose your nearest Kelebek Designers studio for a consultation, project discussion, or site visit.</p>
        </motion.div>
        <div className="branch-grid">
          {branches.map((branch, index) => {
            const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(branch.mapQuery)}&output=embed`;
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.mapQuery)}`;
            return (
              <motion.article className="branch-card" key={branch.name} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: index * 0.12 }}>
                <div className="branch-map"><iframe src={mapUrl} title={`${branch.name} location map`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
                <div className="branch-card-body">
                  <span className="branch-kicker">Kelebek Designers</span>
                  <h3>{branch.name}</h3>
                  <p className="branch-location">{branch.location}</p>
                  <p className="branch-description">{branch.description}</p>
                  <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn-gold-outline branch-directions">Get Directions <span aria-hidden="true">→</span></a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
