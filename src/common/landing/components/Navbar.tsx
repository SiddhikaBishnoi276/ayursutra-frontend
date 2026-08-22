import { Leaf, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import ayursutraLogo from "../../../assets/Ayur-Sutra-logo.png";

const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Features", href: "#features", id: "features" },
  { label: "About Panchakarma", href: "#panchakarma", id: "panchakarma" },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Mark contact as active when on contact hash view
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#contact") setActiveSection("contact");
      else if (window.location.hash === "#login") setActiveSection("");
    };
    window.addEventListener("hashchange", sync);
    sync();
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const handleLoginClick = () => {
    window.location.hash = "login";
    window.scrollTo(0, 0);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (window.location.hash === "#contact") {
      // Already on contact, dispatch event manually
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      window.location.hash = "contact";
    }
    window.scrollTo(0, 0);
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === "#contact") {
      handleContactClick(e);
    } else {
      // If we were on contact view, go back to home first
      if (window.location.hash === "#contact") {
        e.preventDefault();
        window.location.hash = href.replace("#", "");
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E1E4DA]"
          : "bg-[#FDFDFA] border-b border-[#E1E4DA]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src={ayursutraLogo}
              alt="AyurSutra Logo"
              className="w-10 h-10 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span
                className="text-xl font-bold tracking-wide text-[#033015]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                AyurSūtra
              </span>
              <span className="text-[10px] text-[#667064] tracking-widest uppercase font-medium">
                Ancient Wisdom • Modern Care
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-[14px] font-medium transition-colors duration-200 relative ${
                    isActive
                      ? "text-[#033015] font-semibold"
                      : "text-[#30352F] hover:text-[#033015]"
                  }`}
                >
                  {link.label}
                  {/* Active underline indicator */}
                  <span
                    className="absolute -bottom-0.5 left-0 h-[2px] bg-[#033015] rounded-full transition-all duration-300"
                    style={{ width: isActive ? "100%" : "0%" }}
                  />
                  {/* Hover underline for inactive */}
                  {!isActive && (
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#033015] transition-all duration-300 group-hover:w-full rounded-full" />
                  )}
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={handleContactClick}
              className={`text-[14px] font-medium transition-colors duration-200 relative ${
                activeSection === "contact"
                  ? "text-[#033015] font-semibold"
                  : "text-[#30352F] hover:text-[#033015] group"
              }`}
            >
              Contact
              <span
                className="absolute -bottom-0.5 left-0 h-[2px] bg-[#033015] rounded-full transition-all duration-300"
                style={{ width: activeSection === "contact" ? "100%" : "0%" }}
              />
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="navbar-login-btn"
              onClick={handleLoginClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#033015] text-white text-sm font-semibold rounded-full hover:bg-[#0C3B17] transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <Leaf size={15} />
              Login / Get Started
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            id="navbar-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-[#033015] hover:bg-[#E9EBDD] transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E1E4DA] px-6 pb-5 pt-3 shadow-lg">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`py-2.5 px-3 text-[15px] font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#033015] text-white"
                      : "text-[#30352F] hover:bg-[#E9EBDD] hover:text-[#033015]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={handleContactClick}
              className={`py-2.5 px-3 text-[15px] font-medium rounded-lg transition-colors ${
                activeSection === "contact"
                  ? "bg-[#033015] text-white"
                  : "text-[#30352F] hover:bg-[#E9EBDD] hover:text-[#033015]"
              }`}
            >
              Contact
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLoginClick();
              }}
              className="mt-3 flex items-center justify-center gap-2 py-3 bg-[#033015] text-white text-sm font-semibold rounded-full hover:bg-[#0C3B17] transition-colors"
            >
              <Leaf size={15} />
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
