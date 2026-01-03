import { z, defineCollection } from 'astro:content';

// 1. Casinos Collection (Updated for Nested Groups)
const casinosCollection = defineCollection({
  type: 'content', 
  schema: ({ image }) => z.object({
    id: z.string().uuid().optional(),
    isActive: z.boolean().default(true),
    rank: z.number().int().min(1),
    name: z.string().max(50),
    logo_url: z.string().or(image()).optional(), // Supports uploaded images
    affiliate_url: z.string().url().optional(),
    
    // Group 1: Targeting
    targeting_group: z.object({
      allowed_geos: z.array(z.string()).default(['global'])
    }).optional(),

    // Group 2: Metrics
    metrics_group: z.object({
      rating: z.number().min(0).max(5).default(0),
      rtp: z.number().min(0).max(100).optional(),
      payout_speed: z.string().optional(),
    }).optional(),

    // Group 3: Offer
    offer_group: z.object({
      welcome_bonus_headline: z.string().optional(),
      bonus_details: z.string().optional(),
      min_deposit: z.string().optional(),
      vip_high_roller: z.boolean().default(false),
    }).optional(),

    // Group 4: Features
    features_group: z.object({
      license: z.string().optional(),
      mobile_app: z.string().optional(),
      customer_service: z.string().optional(),
      banking: z.array(
        z.object({
          method: z.string(),
          icon: z.string().or(image()).optional()
        })
      ).optional(),
      providers: z.array(
        z.object({
          name: z.string(),
          logo: z.string().or(image()).optional()
        })
      ).optional(),
    }).optional(),
  })
});

// 2. Pages Collection
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updatedDate: z.date().optional(),
  })
});

// 3. Settings Collection
const settingsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    site_title: z.string().optional(),
    site_description: z.string().optional(),
    contact_email: z.string().email().optional(),
    header_scripts: z.string().optional(),
    footer_scripts: z.string().optional(),
  })
});

export const collections = {
  'casinos': casinosCollection,
  'pages': pagesCollection,
  'settings': settingsCollection,
};