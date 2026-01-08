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

// 2. Casinos Collection (Schema Matching Table)
const casinosCollection = defineCollection({
  type: 'content', 
  schema: ({ image }) => z.object({
    
    // Group 1: Core Identity
    core_identity: z.object({
      isActive: z.boolean().default(true),
      name: z.string(),
    }),

    // Group 2: Ranking & Visibility
    ranking_visibility: z.object({
      rank: z.number().int().min(1),
      targeting_group: z.array(z.string()).default(['global']), // Allowed Geos
    }),

    // Group 3: Branding & Links
    branding_links: z.object({
      logo_url: z.string().or(image()),
      affiliate_url: z.string().url(),
    }),

    // Group 4: Ratings & Metrics
    ratings_metrics: z.object({
      rating: z.number().min(0).max(5).default(0),
      rtp: z.number().min(0).max(100).optional(),
    }),

    // Group 5: Offer Data
    offer_data: z.object({
      bonus_headline: z.string(),
      wager_time: z.string().optional(),
      wagering_req: z.string().optional(),
      vip_high_roller: z.string().optional(), // Changed from boolean to string
    }),

    // Group 6: Payment Data
    payment_data: z.object({
      payout_speed: z.string(),
      min_deposit: z.string(),
      banking_list: z.array(
        z.object({
          data_ref: z.string().optional(),
          custom_name: z.string().optional(),
          custom_icon: z.string().or(image()).optional()
        })
      ).optional(),
    }),

    // Group 7: Games & Providers
    games_providers: z.object({
      game_types: z.array(z.string()).default([]),
      game_count: z.number().optional(),
      providers_list: z.array(
        z.object({
          data_ref: z.string().optional(),
          custom_name: z.string().optional(),
          custom_icon: z.string().or(image()).optional()
        })
      ).optional(),
    }),

    // Group 8: Technical Details
    technical_details: z.object({
      license: z.string(),
      mobile_app: z.array(z.string()).optional(), // Changed to array
      customer_service: z.string().optional(),
    }),
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