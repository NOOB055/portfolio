import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * Admission control for content: frontmatter that fails these schemas
 * fails the build. Bad content cannot reach production.
 */

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.mdx' }),
	schema: z.object({
		title: z.string().max(70, 'keep titles under 70 chars for search/OG cards'),
		description: z.string().max(200),
		pubDate: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});

const achievements = defineCollection({
	loader: glob({ base: './src/content/achievements', pattern: '**/*.mdx' }),
	schema: z.object({
		title: z.string(),
		role: z.string(),
		period: z.string(),
		stack: z.array(z.string()).default([]),
		impact: z.string().max(160, 'one quantified outcome line'),
		featured: z.boolean().default(false),
	}),
});

const certifications = defineCollection({
	loader: glob({ base: './src/content/certifications', pattern: '**/*.yaml' }),
	schema: z.object({
		name: z.string(),
		issuer: z.string(),
		issueDate: z.coerce.date(),
		expiryDate: z.coerce.date().optional(),
		credentialId: z.string().optional(),
		verifyUrl: z.string().url().optional(),
	}),
});

export const collections = { blog, achievements, certifications };
