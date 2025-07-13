import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sanity } from '@/lib/sanity';
import { Post } from '@/lib/types';

/**
 * Fetch post by slug from Sanity
 */
async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `*[_type == "post" && slug.current == $slug][0]{title, "slug": slug.current, excerpt, content}`;
  return await sanity.fetch(query, { slug });
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) return notFound();

  return (
    <article className="max-w-2xl mx-auto py-12 px-4 prose dark:prose-invert">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-secondary mb-4">{post.excerpt}</p>
      <div>{post.content}</div>
      <Link
        href="/blog"
        className="block mt-8 text-accent hover:underline font-semibold"
      >
        &larr; Back to Blog
      </Link>
    </article>
  );
}