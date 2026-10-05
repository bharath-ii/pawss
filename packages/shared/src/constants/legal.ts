// ─────────────────────────────────────────────
// PAWWS — Legal Disclosures & Privacy Content
// Production-compliant policies for App Stores & Web
// ─────────────────────────────────────────────

export const LEGAL_CONTENT = {
  APP_NAME: 'PAWWS',
  COMPANY_NAME: 'PAWWS Pet Marketplace Technologies Pvt. Ltd.',
  SUPPORT_EMAIL: 'support@pawws.app',
  SUPPORT_PHONE: '+91 98765 43210',
  SUPPORT_WHATSAPP: '+91 98765 43210',
  EFFECTIVE_DATE: 'September 25, 2026',
  VERSION: '1.0.0',

  GOOGLE_MAPS_ATTRIBUTION:
    'Map data and location features in this application are powered by Google Maps Platform. Use of Google Maps is subject to the Google Privacy Policy (https://policies.google.com/privacy) and Google Terms of Service (https://policies.google.com/terms).',

  PRIVACY_POLICY: {
    title: 'PAWWS Privacy Policy',
    lastUpdated: 'September 25, 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        content: `We collect information necessary to provide pet care marketplace services:
• Account Information: Full name, email address, phone number, and profile picture.
• Pet Profiles: Pet name, species, breed, age, weight, vaccination records, dietary requirements, and medical history.
• Location Data: Precise or approximate GPS location when finding nearby service providers or enabling live tracking for home-delivered pet services (powered by Google Maps Platform).
• Payment Data: Transaction details, billing address, and payment confirmation IDs. Note: Full card numbers and UPI MPINs are securely handled by our PCI-DSS certified payment gateway (Razorpay) and are never stored on PAWWS servers.
• Communications: Messages exchanged between pet owners and service providers via in-app chat.`,
      },
      {
        heading: '2. How We Use Your Information',
        content: `Your data is utilized strictly for service delivery:
• Connecting pet parents with verified pet care professionals (groomers, vets, walkers, trainers, boarding facilities).
• Calculating real-time travel distances and service availability using Google Maps.
• Processing bookings, refunds, platform loyalty credits, and invoices.
• Delivering critical service updates, appointment reminders, and emergency alerts.
• Preventing fraud, verifying partner credentials, and ensuring animal safety standards.`,
      },
      {
        heading: '3. Data Sharing & Third Parties',
        content: `We never sell your personal data. We share information only with:
• Assigned Service Providers: Partner receives customer contact name, pet profile, and service address solely to fulfill the booked service.
• Google Maps Platform: Location coordinates for distance calculation and map rendering.
• Razorpay: Encrypted transaction identifiers for payment settlement.
• Firebase (Google Cloud): Encrypted cloud database and push notification delivery (FCM).`,
      },
      {
        heading: '4. Data Retention & Your Rights',
        content: `You maintain complete control over your personal data:
• Access & Correction: You may view and edit your profile, pets, and address details at any time in the Account section.
• Data Portability: You may request an export of your booking and pet medical records by contacting privacy@pawws.app.
• Account Deletion: You may permanently delete your account and all associated personal data directly within the app under Settings > Data & Privacy > Delete Account. Upon deletion, your profile, pet records, saved addresses, and active credentials will be permanently erased within 30 days, subject only to statutory tax record retention requirements.`,
      },
      {
        heading: '5. Children’s Privacy',
        content: 'PAWWS services are not directed to individuals under 18 years of age. We do not knowingly collect personal data from minors.',
      },
      {
        heading: '6. Contact Our Data Protection Officer',
        content: 'If you have questions about this policy or your data rights, contact our Data Protection Team at privacy@pawws.app or write to: PAWWS Privacy Office, Bengaluru, Karnataka, India.',
      },
    ],
  },

  TERMS_OF_SERVICE: {
    title: 'PAWWS Terms of Service',
    lastUpdated: 'September 25, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content: 'By creating an account or using the PAWWS mobile applications or website, you agree to comply with and be bound by these Terms of Service and our Community Pet Safety Guidelines.',
      },
      {
        heading: '2. Marketplace Platform Nature',
        content: 'PAWWS operates an online technology platform connecting independent pet owners with independent pet care service providers. PAWWS verifies partner identity and basic documentation but does not directly employ service providers. Partners are independent contractors responsible for professional care standards.',
      },
      {
        heading: '3. Pet Owner Responsibilities',
        content: `As a pet parent, you warrant that:
• All pets registered are up to date on mandatory vaccinations (e.g. Rabies, DHPP).
• You provide truthful disclosure of any aggressive tendencies, biting history, or contagious medical conditions.
• You provide a safe, sanitary environment when booking home-visit services.`,
      },
      {
        heading: '4. Booking, Pricing & Payments',
        content: 'Service prices are displayed in Indian Rupees (INR) inclusive of applicable GST and platform service fees. Payments must be processed through the authorized in-app checkout. Offline cash side-agreements are strictly prohibited and void all platform pet insurance protections.',
      },
      {
        heading: '5. Cancellation & Refund Policy',
        content: 'Free cancellation is permitted up to 4 hours prior to the scheduled booking start time. Cancellations within 4 hours may incur a provider compensation fee of up to 30%. In the event of service provider no-show, customers receive a 100% immediate refund.',
      },
      {
        heading: '6. Limitation of Liability',
        content: 'To the maximum extent permitted by law, PAWWS shall not be liable for indirect, incidental, or consequential damages arising from partner service delivery beyond the platform booking fee paid.',
      },
      {
        heading: '7. Governing Law',
        content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, India.',
      },
    ],
  },

  ACCOUNT_DELETION: {
    title: 'Delete PAWWS Account',
    warning:
      'Account deletion is irreversible. Once confirmed, all your data will be permanently purged from our active systems.',
    itemsDeleted: [
      'Personal profile, phone number, and email credentials',
      'All registered pet profiles, photos, and medical notes',
      'Saved delivery and service addresses',
      'Favorite partners and bookmarked services',
      'In-app chat history and message attachments',
      'Active push notification tokens',
    ],
    itemsRetained: [
      'Invoices and payment transaction IDs retained for 7 years to comply with Indian GST and financial auditing laws (anonymized of your contact details).',
    ],
  },
};
