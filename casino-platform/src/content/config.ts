// SECTION 5: Database Schema & Data Modeling
// Defines strict types for the Content Collections

import { z, defineCollection } from 'astro:content';

// 1. Casinos Collection (The Core Product)
const casinosCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    id: z.string().uuid().optional(),
    isActive: z.boolean().default(true),
    rank: z.number().int().min(1),
    name: z.string().max(50),
    logo_url: z.string(),
    affiliate_url: z.string().url(),
    allowed_geos: z.array(z.string()).default(['global']),
    rating: z.number().min(0).max(5),
    rtp: z.number().min(0).max(100),
    welcome_bonus_headline: z.string(),
    bonus_details: z.string().optional(),
    payout_speed: z.string(),
    min_deposit: z.string(),
    license: z.string(),
    banking: z.array(
      z.object({
        method: z.string(),
        icon: z.string().optional()
      })
    ),
    providers: z.array(
      z.object({
        name: z.string(),
        logo: z.string().optional()
      })
    ).optional(),
    vip_high_roller: z.boolean().default(false),
    mobile_app: z.string().optional(),
    customer_service: z.string().optional()
  })
});

// 2. Pages Collection (For standard site pages)
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updatedDate: z.date().optional(),
  })
});

// 3. Settings Collection (Global Site Config)
const settingsCollection = defineCollection({
  type: 'data', // 'data' type for JSON files
  schema: z.object({
    site_title: z.string(),
    site_description: z.string(),
    contact_email: z.string().email(),
    social_links: z.object({
      twitter: z.string().url().optional(),
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional()
    }).optional()
  })
});

export const collections = {
  'casinos': casinosCollection,
  'pages': pagesCollection,
  'settings': settingsCollection,
};