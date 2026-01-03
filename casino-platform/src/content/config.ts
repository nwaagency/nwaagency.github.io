// SECTION 5: Database Schema & Data Modeling
// Defines strict types for the Content Collections

import { z, defineCollection } from 'astro:content';

const casinosCollection = defineCollection({
  type: 'content', // v2.0+ standard
  schema: z.object({
    id: z.string().uuid().optional(),
    isActive: z.boolean().default(true),
    
    // Core Info
    rank: z.number().int().min(1),
    name: z.string().max(50),
    logo_url: z.string(), // Image path from CMS
    affiliate_url: z.string().url(),
    
    // Targeting
    allowed_geos: z.array(z.string()).default(['global']),
    
    // Ratings
    rating: z.number().min(0).max(5),
    rtp: z.number().min(0).max(100),
    
    // Offer
    welcome_bonus_headline: z.string(),
    bonus_details: z.string().optional(), // Markdown body
    
    // Technicals
    payout_speed: z.string(),
    min_deposit: z.string(),
    license: z.string(),
    
    // Lists
    banking: z.array(
      z.object({
        method: z.string(),
        icon: z.string().optional()
      })
    ),
    providers: z.array(
      z.object({
        name: z.string()
      })
    ).optional(),
    
    vip_high_roller: z.boolean().default(false),
  })
});

export const collections = {
  'casinos': casinosCollection,
};