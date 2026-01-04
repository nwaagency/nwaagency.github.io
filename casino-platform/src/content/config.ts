import { z, defineCollection } from 'astro:content';

// 1. Banking & Providers (Master Lists)
const bankingCollection = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    name: z.string(),
    icon: z.string().or(image()).optional()
  })
});

const providersCollection = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    name: z.string(),
    icon: z.string().or(image()).optional()
  })
});

// 2. Casinos Collection
const casinosCollection = defineCollection({
  type: 'content', 
  schema: ({ image }) => z.object({
    // ID Removed
    isActive: z.boolean().default(true),
    
    // Identity
    identity_group: z.object({
      isActive: z.boolean().default(true),
      rank: z.number().int().min(1),
      name: z.string(),
      logo_url: z.string().or(image()).optional(),
      affiliate_url: z.string().url().optional(),
    }).optional(),

    // Metrics
    metrics_group: z.object({
      rating: z.number().min(0).max(5).default(0),
      rtp: z.number().min(0).max(100).optional(),
      payout_speed: z.string().optional(),
      min_deposit: z.string().optional(),
    }).optional(),

    // Offer
    offer_group: z.object({
      welcome_bonus_headline: z.string().optional(),
      vip_high_roller: z.boolean().default(false),
    }).optional(),

    // Features
    features_group: z.object({
      license: z.string().optional(),
      mobile_app: z.string().optional(),
      customer_service: z.string().optional(),
      
      // New List Structure
      banking_list: z.array(
        z.object({
          data_ref: z.string().optional(),
          custom_name: z.string().optional(),
          custom_icon: z.string().or(image()).optional()
        })
      ).optional(),
      
      providers_list: z.array(
        z.object({
          data_ref: z.string().optional(),
          custom_name: z.string().optional(),
          custom_icon: z.string().or(image()).optional()
        })
      ).optional(),
    }).optional(),
  })
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    body: z.string().optional(),
  })
});

const settingsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    site_title: z.string().optional(),
    contact_email: z.string().optional(),
  })
});

export const collections = {
  'casinos': casinosCollection,
  'banking_data': bankingCollection,
  'providers_data': providersCollection,
  'pages': pagesCollection,
  'settings': settingsCollection,
};