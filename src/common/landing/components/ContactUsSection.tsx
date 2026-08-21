import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export const ContactUsSection: React.FC = () => {
  return (
    <section 
      id="contact-section"
      className="min-h-screen pt-28 pb-20 md:pt-32 md:pb-24 px-6 lg:px-8 flex items-center" 
      style={{ 
        background: 'linear-gradient(135deg, #FCFBF5 0%, #FCFBF5 60%, #e6f2e6 100%)' 
      }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* Left Side: Contact Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 
              className="text-4xl md:text-5xl xl:text-6xl font-bold mb-4 tracking-tight text-[#15803d]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Get in Touch
            </h2>
            <p 
              className="text-lg md:text-xl font-bold text-[#111111] mb-12"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              We're here to help you
            </p>

            {/* Contact Details */}
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone size={18} className="text-[#15803d]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#111111] mb-1">Phone</h4>
                  <p className="text-[15px] text-[#4b5563]">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail size={18} className="text-[#15803d]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#111111] mb-1">Email</h4>
                  <p className="text-[15px] text-[#4b5563]">support@ayursutra.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={18} className="text-[#15803d]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#111111] mb-1">Address</h4>
                  <p className="text-[15px] text-[#4b5563] leading-relaxed">
                    125 Ayurveda Street, Wellness City,<br />
                    India - 100001
                  </p>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-[16px] font-bold text-[#111111] mb-4">Follow Us</h4>
              <div className="flex items-center gap-4">
                {/* Facebook */}
                <a href="#" className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                {/* Instagram */}
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" style={{background:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)'}}>
                  <svg className="w-5 h-5 stroke-white fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                {/* YouTube */}
                <a href="#" className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-[#E1E4DA]/50">
              <form className="flex flex-col gap-5">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E1E4DA] bg-[#FDFDFA] text-[#111111] text-[15px] focus:outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E1E4DA] bg-[#FDFDFA] text-[#111111] text-[15px] focus:outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E1E4DA] bg-[#FDFDFA] text-[#111111] text-[15px] focus:outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-colors"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Your Message" 
                    rows={4}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E1E4DA] bg-[#FDFDFA] text-[#111111] text-[15px] focus:outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  type="button"
                  className="w-full mt-2 py-4 rounded-xl bg-[#033015] text-white font-bold text-[16px] hover:bg-[#0C3B17] transition-colors shadow-md"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
