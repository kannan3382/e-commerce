import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle2, ChevronDown, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Order & Shipping Inquiry',
    message: '',
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please complete all form fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been received by our California support team!', 'success');
  };

  const faqs = [
    {
      q: 'How long does domestic and international delivery take?',
      a: 'Domestic US ground orders are dispatched within 24 hours and arrive within 2-4 business days. Priority Overnight orders placed before 2 PM PST arrive by 10:30 AM the following morning. International express delivery typically takes 4-7 business days.',
    },
    {
      q: 'What is the 30-day home trial and return policy?',
      a: 'We encourage you to test our hardware in your daily studio environment. If you are not completely satisfied, return it within 30 days of delivery in original packaging for a 100% full refund. A prepaid domestic return label is provided.',
    },
    {
      q: 'What does the 2-Year Precision Warranty cover?',
      a: 'Our warranty covers any acoustic driver faults, Bluetooth connection abnormalities, titanium casing manufacturing defects, and battery degradation under 80% capacity within 24 months of purchase.',
    },
    {
      q: 'Can I change or cancel my order after placement?',
      a: 'Because our fulfillment hub processes orders rapidly, please email concierge@aura.store or call our hotline within 60 minutes of placing your order to make adjustments.',
    },
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Concierge & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            We are here to assist your setup.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Have a question regarding custom acoustic orders, firmware calibration, or shipping? Reach out directly.
          </p>
        </div>

        {/* 2-Column Contact Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Channels & Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-950">Direct Channels</h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email Concierge</h4>
                    <p className="text-slate-500 mt-0.5">concierge@aura.store</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">Response within 2 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Customer Care Hotline</h4>
                    <p className="text-slate-500 mt-0.5">+1 (800) 555-AURA</p>
                    <span className="text-[10px] text-slate-400">Mon - Fri: 8 AM – 6 PM PST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Design Studio & Fulfillment</h4>
                    <p className="text-slate-500 mt-0.5">500 Howard Street, Suite 400</p>
                    <p className="text-slate-500">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>

              {/* Live Support Status */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-xs text-emerald-900">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Our hardware calibration and shipping center is operating at full capacity.</span>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">Message Sent Successfully!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you for contacting AURA. A dedicated studio concierge has been assigned to your ticket and will reply to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'Order & Shipping Inquiry', message: '' });
                    }}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-950 mb-2">Send Us a Message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Your Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Subject Category</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-950"
                    >
                      <option>Order & Shipping Inquiry</option>
                      <option>Technical Product Specifications</option>
                      <option>Warranty Claim & Returns</option>
                      <option>Wholesale & Studio Bulk Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Your Message *</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please include any relevant order numbers or setup details..."
                      className="mt-1 w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl font-bold text-slate-950">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Quick answers regarding shipping, warranties, and orders.</p>
          </div>

          <div className="divide-y divide-slate-100 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-700 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
