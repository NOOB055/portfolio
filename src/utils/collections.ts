import { getCollection } from 'astro:content';

/**
 * Published posts, newest first. Drafts stay visible in `astro dev`
 * so they can be previewed; production builds never include them.
 * (RSS keeps its own strict filter — feeds must never leak drafts.)
 */
export const getPublishedPosts = async () =>
	(
		await getCollection(
			'blog',
			({ data }) => import.meta.env.DEV || !data.draft,
		)
	).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
