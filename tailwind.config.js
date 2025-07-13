import { createClient } from 'contentful';

const client = createClient({ /* credentials */ });

async function getPostBySlug(slug) {
  const entries = await client.getEntries({ content_type: 'post', 'fields.slug': slug });
  return entries.items[0]?.fields;
}