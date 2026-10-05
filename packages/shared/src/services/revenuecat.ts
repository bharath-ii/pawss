// ─────────────────────────────────────────────
// PAWWS — RevenueCat Integration (Dummy / Sandbox Mode)
// Enables in-app subscriptions with seamless switch to production
// ─────────────────────────────────────────────

export interface RevenueCatCustomerInfo {
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  entitlements: {
    active: Record<string, { identifier: string; isActive: boolean; willRenew: boolean; expirationDate?: string }>;
  };
}

export interface RevenueCatPackage {
  identifier: string;
  packageType: 'MONTHLY' | 'ANNUAL' | 'LIFETIME' | 'CUSTOM';
  product: {
    identifier: string;
    description: string;
    title: string;
    price: number;
    priceString: string;
    currencyCode: string;
  };
}

export interface RevenueCatOffering {
  identifier: string;
  serverDescription: string;
  availablePackages: RevenueCatPackage[];
  monthly?: RevenueCatPackage;
  annual?: RevenueCatPackage;
}

// Dummy Offerings for PAWWS Pet Club & Partner Pro
export const DUMMY_OFFERINGS: Record<string, RevenueCatOffering> = {
  pawws_club: {
    identifier: 'pawws_club',
    serverDescription: 'PAWWS Pet Club Membership',
    availablePackages: [
      {
        identifier: '$rc_monthly',
        packageType: 'MONTHLY',
        product: {
          identifier: 'pawws_club_monthly',
          title: 'PAWWS Club Monthly',
          description: 'Unlimited free vet tele-consultations, 15% discount on all bookings, free pet insurance coverage up to ₹50,000.',
          price: 299,
          priceString: '₹299/mo',
          currencyCode: 'INR',
        },
      },
      {
        identifier: '$rc_annual',
        packageType: 'ANNUAL',
        product: {
          identifier: 'pawws_club_annual',
          title: 'PAWWS Club Annual (Save 30%)',
          description: 'All monthly benefits + 2 free grooming sessions per year + priority booking slot access.',
          price: 2499,
          priceString: '₹2,499/yr',
          currencyCode: 'INR',
        },
      },
    ],
  },
  partner_pro: {
    identifier: 'partner_pro',
    serverDescription: 'PAWWS Partner Pro Tier',
    availablePackages: [
      {
        identifier: '$rc_monthly',
        packageType: 'MONTHLY',
        product: {
          identifier: 'partner_pro_monthly',
          title: 'Partner Pro Tier',
          description: 'Reduced commission (10% instead of 18%), top search placement in your pincode, automated WhatsApp reminders.',
          price: 499,
          priceString: '₹499/mo',
          currencyCode: 'INR',
        },
      },
    ],
  },
};

class RevenueCatService {
  private isConfigured = false;
  private currentUserId: string | null = null;
  private activeEntitlements: Set<string> = new Set();

  /**
   * Initializes RevenueCat with Android / iOS API keys
   */
  public async configure(apiKey: string, appUserId?: string): Promise<void> {
    this.currentUserId = appUserId || 'anonymous_user';
    this.isConfigured = true;
    console.log(`[RevenueCat] Initialized in sandbox/dummy mode for user: ${this.currentUserId}`);
  }

  /**
   * Fetches current subscriber info
   */
  public async getCustomerInfo(): Promise<RevenueCatCustomerInfo> {
    return {
      activeSubscriptions: Array.from(this.activeEntitlements),
      allPurchasedProductIdentifiers: Array.from(this.activeEntitlements),
      entitlements: {
        active: Object.fromEntries(
          Array.from(this.activeEntitlements).map((id) => [
            id,
            { identifier: id, isActive: true, willRenew: true, expirationDate: new Date(Date.now() + 30 * 86400000).toISOString() },
          ])
        ),
      },
    };
  }

  /**
   * Gets available offerings / packages
   */
  public async getOfferings(): Promise<Record<string, RevenueCatOffering>> {
    return DUMMY_OFFERINGS;
  }

  /**
   * Simulates purchasing a package
   */
  public async purchasePackage(pkg: RevenueCatPackage): Promise<{ customerInfo: RevenueCatCustomerInfo }> {
    console.log(`[RevenueCat] Purchased dummy package: ${pkg.identifier} (${pkg.product.title})`);
    this.activeEntitlements.add(pkg.product.identifier);
    const info = await this.getCustomerInfo();
    return { customerInfo: info };
  }

  /**
   * Simulates restoring purchases
   */
  public async restorePurchases(): Promise<RevenueCatCustomerInfo> {
    console.log(`[RevenueCat] Restoring purchases for user ${this.currentUserId}`);
    return this.getCustomerInfo();
  }
}

export const revenueCat = new RevenueCatService();
