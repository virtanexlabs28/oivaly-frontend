"use client";

import Link from "next/link";
import {
  ShieldCheckIcon,
  LockKeyIcon,
  FileTextIcon,
  PrinterIcon,
  CheckCircleIcon,
  BuildingsIcon,
  DatabaseIcon,
  UserCheckIcon,
  ScalesIcon,
} from "@phosphor-icons/react";

export default function PrivacyPolicyPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const subProcessors = [
    {
      name: "Posti Group Oyj",
      purpose: "Postal parcel logistics, automated SmartPost locker routing, and JJFI barcode tracking",
      location: "Helsinki, Finland (EU)",
      safeguard: "Direct Finnish Data Processing Agreement (DPA)",
    },
    {
      name: "Stripe Payments Europe, Ltd.",
      purpose: "Encrypted payment card processing, 3D-Secure 2.0 authentication, PSD2 open banking",
      location: "Dublin, Ireland (EU)",
      safeguard: "PCI-DSS Level 1 Service Provider & EU Standard Contractual Clauses",
    },
    {
      name: "Finnish Patent and Registration Office (PRH)",
      purpose: "Automated public registry verification of seller Finnish Business IDs (Y-tunnus)",
      location: "Helsinki, Finland (EU)",
      safeguard: "Finnish Government Open Data Public API",
    },
    {
      name: "Cloudflare, Inc. (EU Edge)",
      purpose: "DDoS mitigation, web application firewall (WAF), and TLS 1.3 cryptographic transport",
      location: "Frankfurt / Helsinki Edge (EU)",
      safeguard: "ISO 27001 Certified & EU Data Localization Option",
    },
  ];

  const retentionSchedule = [
    {
      category: "Fiscal & Transaction Invoices",
      duration: "7 years",
      rationale: "Statutory mandate pursuant to the Finnish Accounting Act (Kirjanpitolaki 1336/1997)",
    },
    {
      category: "Posti Courier Consignment Records",
      duration: "180 days",
      rationale: "Necessary for transit claim investigations, insurance settlements, and delivery verification",
    },
    {
      category: "Active Customer Accounts",
      duration: "Duration of account + 30 days upon deletion",
      rationale: "To facilitate purchase history access and warranty records",
    },
    {
      category: "Web Server & Security Logs",
      duration: "30 days (Rolling deletion)",
      rationale: "Legitimate interest in cyber threat detection, intrusion prevention, and rate-limiting",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground print:hidden">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Privacy Policy</span>
        </nav>

        {/* Hero & Print */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-border/60 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
              <LockKeyIcon className="size-4" weight="fill" />
              <span>GDPR Articles 13 & 14 Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
              Privacy & Personal Data Protection Policy
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Last Updated: October 1, 2026. This comprehensive privacy notice explains how Oivaly Oy (&ldquo;Oivaly&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) collects, processes, secures, and safeguards personal data in strict conformity with Regulation (EU) 2016/679 (GDPR) and the Finnish Data Protection Act (Tietosuojalaki 1050/2018).
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="print:hidden px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 self-start"
          >
            <PrinterIcon className="size-4" />
            <span>Print Policy</span>
          </button>
        </div>

        {/* Executive Highlights */}
        <div className="p-5 bg-brand-warm-ivory dark:bg-card border border-border/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldCheckIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
            <span>Core Privacy Commitments</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-muted-foreground">
            <div>
              <strong className="text-foreground block">Zero Data Selling:</strong> We never sell, rent, or monetize your personal information or shopping behavior to third-party ad networks.
            </div>
            <div>
              <strong className="text-foreground block">EU/EEA Data Residency:</strong> All primary databases and transactional records are hosted exclusively within certified European data centers.
            </div>
            <div>
              <strong className="text-foreground block">Statutory Rights Guaranteed:</strong> Seamless self-service tools to request data export, rectification, or complete deletion (&apos;Right to be Forgotten&apos;).
            </div>
          </div>
        </div>

        {/* Deep Sections */}
        <div className="space-y-10 text-xs leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              1. Identity of the Data Controller
            </h2>
            <p>
              Under Article 4(7) of the General Data Protection Regulation (GDPR), the legal entity responsible for the collection and processing of your personal data is:
            </p>
            <div className="p-4 bg-muted/30 border border-border/60 font-mono text-[11px] space-y-1 text-foreground">
              <div><strong>Company:</strong> Oivaly Oy</div>
              <div><strong>Finnish Business ID (Y-tunnus):</strong> 3412984-7</div>
              <div><strong>Registered Office:</strong> Mannerheimintie 10, 00100 Helsinki, Finland</div>
              <div><strong>Data Protection Officer (DPO):</strong> privacy@oivaly.fi</div>
              <div><strong>Telephone:</strong> +358 9 4245 8190</div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              2. Categories of Personal Data Collected
            </h2>
            <p>
              Depending on how you interact with our platform (as a retail customer, artisan merchant, or website visitor), we process the following categories of information:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Contact & Customer Identity:</strong> Full legal name, billing address, physical shipping address, email address, and mobile phone number (vital for Posti automated SmartPost locker PIN dispatches).</li>
              <li><strong>Transaction & Payment Records:</strong> Order numbers, item selections, monetary amounts, currency, timestamp, payment method token, and invoice history. Card details are encrypted directly via Stripe; raw credit card numbers are never stored on Oivaly infrastructure.</li>
              <li><strong>Artisan Studio Merchant Data:</strong> Registered Finnish Business ID (Y-tunnus), company trade name, registered atelier address, Finnish IBAN bank account details for SEPA payouts, and VAT registration status with Verohallinto.</li>
              <li><strong>Logistics & Consignment Tracking:</strong> Posti JJFI barcode identifiers, delivery status milestones, locker terminal identifiers, and recipient collection signatures.</li>
              <li><strong>Technical & Session Telemetry:</strong> Anonymized IP addresses, browser agent strings, operating system, and essential cookies for session continuity.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              3. Legal Bases for Data Processing (GDPR Article 6)
            </h2>
            <p>
              We process your personal information only when an explicit lawful basis applies under European law:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-muted/20 border border-border/60 space-y-1">
                <strong className="text-foreground block">Contractual Performance (Art. 6(1)(b))</strong>
                Processing is required to fulfill your purchase order, process payment, coordinate packaging with the maker studio, and book courier transit with Posti.
              </div>
              <div className="p-3 bg-muted/20 border border-border/60 space-y-1">
                <strong className="text-foreground block">Legal Obligation (Art. 6(1)(c))</strong>
                Compliance with statutory Finnish tax accounting under the Accounting Act (Kirjanpitolaki) and European consumer protection directives.
              </div>
              <div className="p-3 bg-muted/20 border border-border/60 space-y-1">
                <strong className="text-foreground block">Legitimate Interests (Art. 6(1)(f))</strong>
                Protecting against fraudulent credit card transactions, safeguarding atelier accounts, and ensuring platform security and network uptime.
              </div>
              <div className="p-3 bg-muted/20 border border-border/60 space-y-1">
                <strong className="text-foreground block">Consent (Art. 6(1)(a))</strong>
                Sending voluntary Nordic design newsletters or storing optional non-essential preference cookies (which you can modify anytime).
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              4. Authorized Sub-Processors & Data Sharing
            </h2>
            <p>
              To deliver our marketplace services, personal data is transferred strictly to vetted sub-processors bound by robust Data Processing Addendums (DPAs):
            </p>
            <div className="border border-border/80 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/80 text-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Partner / Processor</th>
                    <th className="p-3">Processing Purpose</th>
                    <th className="p-3">Jurisdiction</th>
                    <th className="p-3">Safeguard Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {subProcessors.map((sp, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-foreground">{sp.name}</td>
                      <td className="p-3 text-muted-foreground">{sp.purpose}</td>
                      <td className="p-3 font-mono text-muted-foreground">{sp.location}</td>
                      <td className="p-3 text-[11px] text-muted-foreground">{sp.safeguard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              5. Statutory Data Retention Schedules
            </h2>
            <p>
              We retain personal data only for as long as necessary to fulfill the purposes for which it was gathered or to satisfy mandatory legal obligations:
            </p>
            <div className="border border-border/80 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/80 text-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Data Record Category</th>
                    <th className="p-3">Retention Period</th>
                    <th className="p-3">Statutory Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {retentionSchedule.map((rs, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-foreground">{rs.category}</td>
                      <td className="p-3 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">{rs.duration}</td>
                      <td className="p-3 text-muted-foreground text-[11px]">{rs.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              6. Your Statutory Rights Under GDPR (Articles 15–22)
            </h2>
            <p>
              As a European data subject, you hold comprehensive rights regarding your personal records:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Right of Access (Art. 15):</strong> Request a full copy of all personal data held about you in a clear, machine-readable JSON format.</li>
              <li><strong>Right to Rectification (Art. 16):</strong> Correct any inaccurate or incomplete details regarding your delivery address or contact records.</li>
              <li><strong>Right to Erasure / &apos;To Be Forgotten&apos; (Art. 17):</strong> Request deletion of your personal account data (excluding transactions required by statutory tax law).</li>
              <li><strong>Right to Restriction (Art. 18):</strong> Restrict processing while a data dispute or claim is formally under investigation.</li>
              <li><strong>Right to Data Portability (Art. 20):</strong> Seamlessly export your profile, order history, and saved artisan collections.</li>
              <li><strong>Right to Object (Art. 21):</strong> Object at any time to non-contractual processing based on legitimate interests.</li>
            </ul>
            <p className="pt-2">
              To exercise any of these statutory rights, please submit an email request to our Data Protection Officer at <a href="mailto:privacy@oivaly.fi" className="font-mono text-primary underline">privacy@oivaly.fi</a>. We respond to all formal requests within thirty (30) calendar days at zero charge.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              7. Supervisory Authority for Inquiries & Grievances
            </h2>
            <p>
              If you believe Oivaly has processed your personal data in violation of GDPR provisions, you have the right to lodge a formal complaint with the competent supervisory authority:
            </p>
            <div className="p-4 bg-muted/30 border border-border/60 font-mono text-[11px] space-y-1 text-foreground">
              <div><strong>Office of the Data Protection Ombudsman (Tietosuojavaltuutetun toimisto)</strong></div>
              <div>Street Address: Lintulahdenkuja 4, 00530 Helsinki, Finland</div>
              <div>Postal Address: PL 800, 00531 Helsinki, Finland</div>
              <div>Website: <a href="https://tietosuoja.fi/en" target="_blank" rel="noopener noreferrer" className="text-primary underline">tietosuoja.fi/en</a></div>
              <div>Email: tietosuoja@om.fi</div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs print:hidden">
          <Link href="/terms" className="font-semibold text-primary hover:underline">
            &larr; View Consumer Terms of Service
          </Link>
          <div className="flex gap-4">
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
              Cookie Preferences
            </Link>
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              Contact Privacy Officer &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
