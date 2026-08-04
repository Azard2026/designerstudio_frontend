"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import KelebekLogo from "../components/KelebekLogo";

type PortfolioItem = {
  id: number;
  title: string;
  slug: string;
  category: string;
  description?: string;
  before_image_url?: string;
  after_image_url?: string;
  youtube_url?: string;
  budget_range?: string;
  client_review?: string;
  created_at: string;
};

function getYouTubeId(url: string): string | null {
  const regexes = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of regexes) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      style={{ display: "block", border: "none" }}
    />
  );
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<{ item: PortfolioItem; mode: "before" | "after" } | null>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [scrolled, setScrolled] = useState(false);

  const filters = ["All", "Residential", "Commercial", "Modular Kitchen"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    fetch("http://localhost:8000/api/portfolio")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("http://localhost:8000/api/settings")
      .then((r) => r.json())
      .then((d) => setSiteSettings(d))
      .catch(() => {});

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeOnEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") { setLightbox(null); setPlayingVideo(null); }
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, [closeOnEsc]);

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  const siteName = siteSettings.site_name || "KELEBEK DESIGNERS";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0A0A0A; color: #FAFAF9; font-family: 'Inter', sans-serif; }
        a { text-decoration: none; color: inherit; }

        .pf-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 1.2rem 2rem; display: flex; align-items: center; justify-content: space-between;
          transition: all 0.4s ease;
        }
        .pf-nav.scrolled {
          background: rgba(10,10,10,0.95); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(201,169,110,0.15);
        }
        .pf-logo-link { display: flex; align-items: center; }
        .pf-back { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #C9A96E; border: 1px solid rgba(201,169,110,0.4); padding: 0.4rem 1rem; transition: all 0.2s; }
        .pf-back:hover { background: rgba(201,169,110,0.1); }

        .pf-hero {
          min-height: 55vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 2rem 80px; position: relative; overflow: hidden;
        }
        .pf-hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .pf-hero-label { font-size: 0.68rem; letter-spacing: 0.25em; text-transform: uppercase; color: #C9A96E; margin-bottom: 1.2rem; }
        .pf-hero-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.4rem, 6vw, 5.5rem); font-weight: 400; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.2rem; }
        .pf-hero-title em { font-style: italic; color: #C9A96E; }
        .pf-hero-sub { font-size: clamp(0.9rem, 1.5vw, 1rem); color: #8A8A8A; max-width: 560px; line-height: 1.8; margin-bottom: 2rem; }
        .pf-hero-line { width: 1px; height: 60px; background: linear-gradient(180deg, #C9A96E, transparent); margin: 0 auto; }

        .pf-filters { display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; padding: 0 2rem 3rem; }
        .pf-filter-btn {
          padding: 0.5rem 1.4rem; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.1); color: #8A8A8A; cursor: pointer;
          transition: all 0.25s; background: transparent; font-family: inherit;
        }
        .pf-filter-btn.active, .pf-filter-btn:hover { border-color: #C9A96E; color: #C9A96E; background: rgba(201,169,110,0.06); }
        .pf-filter-btn.active { color: #0A0A0A; background: #C9A96E; }

        .pf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5px;
          padding: 0 1.5px 80px;
          max-width: 1600px; margin: 0 auto;
        }
        @media (min-width: 1200px) {
          .pf-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .pf-card {
          position: relative; overflow: hidden; cursor: pointer; aspect-ratio: 4/3;
          background: #111;
        }
        .pf-card.wide { grid-column: span 2; aspect-ratio: 16/7; }
        .pf-card-media { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94); }
        .pf-card:hover .pf-card-media { transform: scale(1.06); }
        .pf-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
          opacity: 0; transition: opacity 0.4s; display: flex; flex-direction: column; justify-content: flex-end; padding: 1.8rem;
        }
        .pf-card:hover .pf-card-overlay { opacity: 1; }
        .pf-card-cat { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A96E; margin-bottom: 0.4rem; }
        .pf-card-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #FFF; margin-bottom: 0.4rem; }
        .pf-card-budget { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
        .pf-card-actions { display: flex; gap: 0.6rem; margin-top: 1rem; }
        .pf-action-btn { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.4rem 0.9rem; border: 1px solid rgba(255,255,255,0.4); color: #FFF; cursor: pointer; background: rgba(0,0,0,0.3); transition: all 0.2s; font-family: inherit; }
        .pf-action-btn:hover { background: rgba(255,255,255,0.15); }
        .pf-action-btn.gold { border-color: #C9A96E; color: #C9A96E; }
        .pf-action-btn.gold:hover { background: rgba(201,169,110,0.2); }

        .pf-yt-card {
          position: relative; overflow: hidden; background: #111; aspect-ratio: 4/3;
        }
        .pf-yt-thumb { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s ease; }
        .pf-yt-card:hover .pf-yt-thumb { transform: scale(1.04); }
        .pf-yt-play {
          position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.5); transition: background 0.3s;
        }
        .pf-yt-card:hover .pf-yt-play { background: rgba(0,0,0,0.4); }
        .pf-yt-btn {
          width: 64px; height: 64px; border-radius: 50%; background: rgba(201,169,110,0.9);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.3s, background 0.3s; margin-bottom: 1rem;
        }
        .pf-yt-card:hover .pf-yt-btn { transform: scale(1.12); background: #C9A96E; }
        .pf-yt-info { text-align: center; padding: 0 1rem; }
        .pf-yt-cat { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A96E; margin-bottom: 0.3rem; }
        .pf-yt-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #FFF; }

        .pf-iframe-card { position: relative; aspect-ratio: 4/3; background: #000; }

        .pf-no-img { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: #444; font-size: 0.85rem; }

        .pf-cat-badge {
          position: absolute; top: 14px; left: 14px; z-index: 2;
          font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase;
          padding: 0.25rem 0.7rem; background: rgba(10,10,10,0.8); color: #C9A96E;
          border: 1px solid rgba(201,169,110,0.3); backdrop-filter: blur(10px);
        }

        /* Lightbox */
        .pf-lightbox {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center;
          padding: 2rem; backdrop-filter: blur(8px);
        }
        .pf-lb-inner { position: relative; max-width: 1100px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; gap: 1rem; }
        .pf-lb-img { width: 100%; max-height: 75vh; object-fit: contain; display: block; }
        .pf-lb-close { position: absolute; top: -2.5rem; right: 0; font-size: 2rem; color: #8A8A8A; cursor: pointer; border: none; background: none; font-family: inherit; transition: color 0.2s; line-height: 1; }
        .pf-lb-close:hover { color: #FFF; }
        .pf-lb-info { display: flex; align-items: center; gap: 1.5rem; }
        .pf-lb-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #FFF; }
        .pf-lb-badge { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.25rem 0.8rem; border: 1px solid #C9A96E; color: #C9A96E; }
        .pf-lb-toggle { display: flex; gap: 0.5rem; margin-left: auto; }
        .pf-lb-tab { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.3rem 0.8rem; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; background: none; color: #8A8A8A; font-family: inherit; transition: all 0.2s; }
        .pf-lb-tab.active { background: #C9A96E; color: #000; border-color: #C9A96E; }

        /* Review cards section */
        .pf-reviews { max-width: 1200px; margin: 0 auto; padding: 60px 2rem 100px; }
        .pf-reviews-title { font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 3vw, 2.4rem); text-align: center; margin-bottom: 0.8rem; }
        .pf-reviews-title em { font-style: italic; color: #C9A96E; }
        .pf-reviews-sub { text-align: center; font-size: 0.85rem; color: #8A8A8A; margin-bottom: 3rem; letter-spacing: 0.05em; }
        .pf-reviews-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        .pf-review-card { background: #111; border: 1px solid rgba(201,169,110,0.1); padding: 2rem; transition: border-color 0.3s; }
        .pf-review-card:hover { border-color: rgba(201,169,110,0.35); }
        .pf-review-stars { color: #C9A96E; font-size: 0.9rem; margin-bottom: 0.8rem; letter-spacing: 0.1em; }
        .pf-review-text { font-size: 0.88rem; color: #B0A898; line-height: 1.8; font-style: italic; margin-bottom: 1.2rem; }
        .pf-review-name { font-size: 0.8rem; font-weight: 600; color: #FAFAF9; }
        .pf-review-project { font-size: 0.72rem; color: #C9A96E; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.2rem; }

        .pf-empty { text-align: center; padding: 6rem 2rem; color: #444; }
        .pf-empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .pf-empty-text { font-size: 1rem; }

        .pf-cta { text-align: center; padding: 80px 2rem; background: linear-gradient(135deg, rgba(201,169,110,0.05), transparent); border-top: 1px solid rgba(201,169,110,0.12); }
        .pf-cta-title { font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 3.5vw, 2.8rem); margin-bottom: 1rem; }
        .pf-cta-title em { font-style: italic; color: #C9A96E; }
        .pf-cta-sub { font-size: 0.9rem; color: #8A8A8A; margin-bottom: 2rem; }
        .pf-cta-btn { display: inline-flex; align-items: center; gap: 0.8rem; padding: 0.9rem 2.2rem; background: linear-gradient(135deg, #C9A96E, #A07A3E); color: #0A0A0A; font-weight: 600; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; transition: opacity 0.2s, transform 0.2s; }
        .pf-cta-btn:hover { opacity: 0.9; transform: translateY(-2px); }

        .pf-spinner { display: flex; align-items: center; justify-content: center; height: 50vh; gap: 0.8rem; color: #444; }
        .pf-dot { width: 8px; height: 8px; border-radius: 50%; background: #C9A96E; animation: pf-bounce 1.2s infinite ease-in-out; }
        .pf-dot:nth-child(2) { animation-delay: 0.2s; }
        .pf-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pf-bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* NAV */}
      <nav className={`pf-nav${scrolled ? " scrolled" : ""}`}>
        <Link href="/" className="pf-logo-link">
          <KelebekLogo variant="horizontal" height={40} />
        </Link>
        <Link href="/" className="pf-back">← Back to Home</Link>
      </nav>

      {/* HERO */}
      <header className="pf-hero">
        <div className="pf-hero-label">Selected Work</div>
        <h1 className="pf-hero-title">
          A Portfolio of<br /><em>Distinction</em>
        </h1>
        <p className="pf-hero-sub">
          From luxury residences to landmark commercial spaces — every project tells a story of transformation.
        </p>
        <div className="pf-hero-line" />
      </header>

      {/* FILTERS */}
      <div className="pf-filters">
        {filters.map((f) => (
          <button
            key={f}
            className={`pf-filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* GRID */}
      {loading ? (
        <div className="pf-spinner">
          <div className="pf-dot" /><div className="pf-dot" /><div className="pf-dot" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="pf-empty">
          <div className="pf-empty-icon">✦</div>
          <div className="pf-empty-text">No portfolio items in this category yet.</div>
        </div>
      ) : (
        <main className="pf-grid">
          {filtered.map((item, idx) => {
            const isYT = !!item.youtube_url;
            const isPlaying = playingVideo === item.id;
            const ytId = item.youtube_url ? getYouTubeId(item.youtube_url) : null;
            const isWide = idx % 5 === 0;

            if (isYT && isPlaying) {
              return (
                <div key={item.id} className={`pf-iframe-card${isWide ? " wide" : ""}`}>
                  <span className="pf-cat-badge">{item.category}</span>
                  <button
                    onClick={() => setPlayingVideo(null)}
                    style={{ position: "absolute", top: 12, right: 12, zIndex: 5, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", color: "#FFF", width: 32, height: 32, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
                    aria-label="Close video"
                  >×</button>
                  <YouTubeEmbed url={item.youtube_url!} title={item.title} />
                </div>
              );
            }

            if (isYT) {
              const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null;
              return (
                <div
                  key={item.id}
                  className={`pf-yt-card${isWide ? " wide" : ""}`}
                  onClick={() => setPlayingVideo(item.id)}
                >
                  <span className="pf-cat-badge">{item.category}</span>
                  {thumb && <img src={thumb} alt={item.title} className="pf-yt-thumb" />}
                  <div className="pf-yt-play">
                    <div className="pf-yt-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A0A0A"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div className="pf-yt-info">
                      <div className="pf-yt-cat">{item.category} · Video Tour</div>
                      <div className="pf-yt-title">{item.title}</div>
                    </div>
                  </div>
                </div>
              );
            }

            const imgSrc = item.after_image_url || item.before_image_url;
            return (
              <div
                key={item.id}
                className={`pf-card${isWide ? " wide" : ""}`}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="pf-cat-badge">{item.category}</span>
                {imgSrc ? (
                  <img src={imgSrc} alt={item.title} className="pf-card-media" />
                ) : (
                  <div className="pf-no-img">
                    <span>✦</span>
                    <span>Image coming soon</span>
                  </div>
                )}
                <div className="pf-card-overlay">
                  <div className="pf-card-cat">{item.category}</div>
                  <div className="pf-card-title">{item.title}</div>
                  {item.budget_range && <div className="pf-card-budget">{item.budget_range}</div>}
                  <div className="pf-card-actions">
                    {item.after_image_url && (
                      <button
                        className="pf-action-btn gold"
                        onClick={(e) => { e.stopPropagation(); setLightbox({ item, mode: "after" }); }}
                      >
                        View After
                      </button>
                    )}
                    {item.before_image_url && (
                      <button
                        className="pf-action-btn"
                        onClick={(e) => { e.stopPropagation(); setLightbox({ item, mode: "before" }); }}
                      >
                        Before
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </main>
      )}

      {/* CLIENT REVIEWS */}
      {items.some((i) => i.client_review) && (
        <section className="pf-reviews">
          <h2 className="pf-reviews-title">Client <em>Testimonials</em></h2>
          <p className="pf-reviews-sub">What our clients say about the transformation</p>
          <div className="pf-reviews-grid">
            {items
              .filter((i) => i.client_review)
              .map((item) => (
                <div key={item.id} className="pf-review-card">
                  <div className="pf-review-stars">★★★★★</div>
                  <p className="pf-review-text">&ldquo;{item.client_review}&rdquo;</p>
                  <div className="pf-review-name">{item.title} Client</div>
                  <div className="pf-review-project">{item.category}</div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="pf-cta">
        <h2 className="pf-cta-title">Ready to Create Something <em>Extraordinary?</em></h2>
        <p className="pf-cta-sub">Let&apos;s bring your vision to life — book a free discovery call today.</p>
        <Link href="/#contact" className="pf-cta-btn">
          Start Your Project →
        </Link>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="pf-lightbox" onClick={() => setLightbox(null)}>
          <div className="pf-lb-inner" onClick={(e) => e.stopPropagation()}>
            <button className="pf-lb-close" onClick={() => setLightbox(null)} aria-label="Close lightbox">×</button>
            <img
              src={lightbox.mode === "before" ? lightbox.item.before_image_url! : lightbox.item.after_image_url!}
              alt={`${lightbox.mode} — ${lightbox.item.title}`}
              className="pf-lb-img"
            />
            <div className="pf-lb-info">
              <div className="pf-lb-title">{lightbox.item.title}</div>
              <div className="pf-lb-badge">{lightbox.item.category}</div>
              {lightbox.item.before_image_url && lightbox.item.after_image_url && (
                <div className="pf-lb-toggle">
                  <button
                    className={`pf-lb-tab${lightbox.mode === "before" ? " active" : ""}`}
                    onClick={() => setLightbox((l) => l ? { ...l, mode: "before" } : null)}
                  >Before</button>
                  <button
                    className={`pf-lb-tab${lightbox.mode === "after" ? " active" : ""}`}
                    onClick={() => setLightbox((l) => l ? { ...l, mode: "after" } : null)}
                  >After</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
