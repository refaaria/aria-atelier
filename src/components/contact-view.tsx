"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { Reveal, Overline, EASE } from "@/components/motion-primitives";
import { Ambient } from "@/components/ambient";

const fields = [
  { name: "name", label: "Full Name", placeholder: "Your name", type: "text" },
  { name: "email", label: "Email", placeholder: "you@email.com", type: "email" },
  { name: "phone", label: "Phone", placeholder: "+62 …", type: "tel" },
] as const;

export function ContactView() {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative bg-ink pb-28 pt-36 md:pt-44">
      <Ambient />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal className="text-center">
          <Overline>Contact</Overline>
          <h1 className="mt-5 font-serif text-4xl text-[#f6f2e9] md:text-6xl">
            Begin a Conversation
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] text-[#f4f1ea]/50">
            Enquiries, sourcing requests and private appointments.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* form */}
          <Reveal>
            <div className="overline text-gold">Send an Enquiry</div>
            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              {fields.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                >
                  <label className="overline mb-2 block text-[#f4f1ea]/45">{f.label}</label>
                  <input
                    type={f.type}
                    required={f.name !== "phone"}
                    placeholder={f.placeholder}
                    className="w-full border border-gold/20 bg-ink-2 px-4 py-3.5 text-[15px] text-[#f4f1ea] placeholder:text-[#f4f1ea]/30 outline-none transition-colors focus:border-gold"
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
              >
                <label className="overline mb-2 block text-[#f4f1ea]/45">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us which timepiece has your attention…"
                  className="w-full resize-none border border-gold/20 bg-ink-2 px-4 py-3.5 text-[15px] text-[#f4f1ea] placeholder:text-[#f4f1ea]/30 outline-none transition-colors focus:border-gold"
                />
              </motion.div>

              <button
                type="submit"
                className="group relative inline-flex items-center gap-2 overflow-hidden bg-gold px-8 py-3.5 overline text-ink"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-gold-soft transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                <span className="relative flex items-center gap-2">
                  <AnimatePresence mode="wait" initial={false}>
                    {sent ? (
                      <motion.span
                        key="sent"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={14} /> Enquiry Received
                      </motion.span>
                    ) : (
                      <motion.span key="send" exit={{ opacity: 0, y: -6 }}>
                        Send Enquiry
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </form>
          </Reveal>

          {/* info */}
          <Reveal delay={0.15} className="space-y-4">
            <div className="border border-gold/15 bg-ink-2 p-8 md:p-10">
              <div className="overline text-gold">Visit the Boutique</div>
              <h2 className="mt-4 font-serif text-3xl text-[#f6f2e9]">Aria&apos;s Atelier</h2>
              <address className="mt-4 space-y-1 text-[15px] not-italic leading-relaxed text-[#f4f1ea]/60">
                <p>Jl. Panglima Batur No. 11</p>
                <p>Banjarbaru, South Kalimantan 70711</p>
                <p>Indonesia</p>
              </address>

              <div className="my-6 h-px w-12 bg-gold/40" />

              <div className="overline text-gold">Opening Hours</div>
              <div className="mt-3 space-y-1 text-[15px] text-[#f4f1ea]/60">
                <p>Monday — Saturday · 10.00 – 20.00</p>
                <p>Sunday · By appointment only</p>
              </div>

              <div className="mt-6 space-y-1 text-[15px] text-[#f4f1ea]/85">
                <p>+62 812 0000 0000</p>
                <p>concierge@ariasatelier.com</p>
              </div>
            </div>

            {/* map placeholder */}
            <div className="relative flex h-56 items-center justify-center overflow-hidden border border-gold/15 bg-gradient-to-br from-ink-3 to-ink">
              <div className="absolute left-1/2 top-0 h-full w-px bg-gold/15" />
              <div className="absolute top-1/2 left-0 h-px w-full bg-gold/15" />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold"
              >
                <span className="h-2 w-2 rounded-full bg-gold" />
              </motion.div>
              <div className="absolute bottom-5 left-0 right-0 text-center overline text-gold/60">
                Boutique — Banjarbaru
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-20 text-center" delay={0.1}>
          <p className="font-display text-2xl italic text-[#f4f1ea]/70">
            &ldquo;We reply within one working day.&rdquo;
          </p>
        </Reveal>
      </div>
    </div>
  );
}
