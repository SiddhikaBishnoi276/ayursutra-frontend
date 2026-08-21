import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import ayursutraLogo from "../../../assets/Ayur-Sutra-logo.jpg";

/* ─── Inline social SVG icons ─── */
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconLinkedin = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const IconYoutube = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="white" />
  </svg>
);

interface FooterSectionProps {
  onRoleLogin?: (role: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onRoleLogin }) => {
  const handleNav = (href: string) => {
    if (href === "#contact") {
      window.location.hash = "contact";
      window.scrollTo(0, 0);
    } else {
      const el = document.getElementById(href.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer style={{ background: "#033015", color: "#fff" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 24px" }}>

        {/* ── Responsive Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={ayursutraLogo} alt="AyurSutra" style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "contain" }} />
              <span style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>AyurSūtra</span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", maxWidth: "240px" }}>
              AyurSutra is a smart Panchakarma management platform designed to simplify operations, enhance patient care and promote holistic wellness.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
              {[
                { icon: <IconFacebook />, label: "Facebook" },
                { icon: <IconInstagram />, label: "Instagram" },
                { icon: <IconLinkedin />, label: "LinkedIn" },
                { icon: <IconYoutube />, label: "YouTube" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} style={{ color: "rgba(255,255,255,0.6)" }} className="footer-social">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Quick Links</p>
            {[
              { label: "Home", href: "#home" },
              { label: "About", href: "#about" },
              { label: "Features", href: "#features" },
              { label: "Panchakarma", href: "#panchakarma" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Roles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Roles</p>
            {[
              { label: "Admin Login", role: "admin" },
              { label: "Doctor Login", role: "doctor" },
              { label: "Therapist Login", role: "therapist" },
              { label: "Patient Login", role: "patient" },
            ].map((r) => (
              <button
                key={r.role}
                onClick={() => onRoleLogin?.(r.role)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "13px", color: "rgba(255,255,255,0.6)", textAlign: "left" }}
                className="footer-link"
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Contact Us</p>
            {[
              { icon: <Phone size={14} />, text: "+91 98765 43210", href: "tel:+919876543210" },
              { icon: <Mail size={14} />, text: "support@ayusutra.com", href: "mailto:support@ayusutra.com" },
              { icon: <MapPin size={14} />, text: "123 Ayurveda Street, Wellness City, India – 100001", href: undefined },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                <span style={{ marginTop: "2px", flexShrink: 0 }}>{item.icon}</span>
                {item.href
                  ? <a href={item.href} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }} className="footer-link">{item.text}</a>
                  : <span style={{ lineHeight: "1.6" }}>{item.text}</span>
                }
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
          © {new Date().getFullYear()} AyurSutra. All rights reserved.
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: #fff !important; }
        .footer-social:hover { color: #fff !important; }
      `}</style>
    </footer>
  );
};
