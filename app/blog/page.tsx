import Link from 'next/link';
import { sanity } from '../../lib/sanity';
import { PostMeta } from '@/lib/types';

interface Author {
  name: string;
  avatarUrl: string;
  bio: string;
}

/**
 * Fetch author info from Sanity
 */
async function getAuthor(): Promise<Author> {
  const query = `*[_type == "author"][0]{name, avatarUrl, bio}`;
  return await sanity.fetch(query);
}

/**
 * Fetch related posts (mock: latest 2 posts)
 */
async function getRelatedPosts(): Promise<PostMeta[]> {
  const query = `*[_type == "post"] | order(_createdAt desc)[0..1]{title, "slug": slug.current, excerpt}`;
  return await sanity.fetch(query);
}

/**
 * Fetch all posts from Sanity
 */
async function getPosts(): Promise<PostMeta[]> {
  const query = `*[_type == "post"]{title, "slug": slug.current, excerpt}`;
  return await sanity.fetch(query);
}

export const metadata = {
  title: 'Blog | Macooking',
  description: 'Browse the latest posts on Macooking.',
};

export default async function BlogPage() {
  const [posts, author, relatedPosts] = await Promise.all([
    getPosts(),
    getAuthor(),
    getRelatedPosts(),
  ]);

  // Table of contents placeholder (no headings in index)
  const tableOfContents = [
    { id: 'blog-list', text: 'Blog Posts' },
    { id: 'related-posts', text: 'Related Posts' },
    { id: 'author-info', text: 'Author' },
  ];

  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary dark:text-light">Blog</h1>

      {/* Table of Contents */}
      <nav className="mb-8">
        <ul className="flex gap-6 flex-wrap text-secondary">
          {tableOfContents.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="hover:text-accent underline">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Blog Posts */}
      <div id="blog-list" className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="bg-light dark:bg-dark border border-secondary rounded-lg p-6 shadow hover:shadow-lg transition-all flex flex-col"
          >
            <h2 className="text-xl font-bold mb-2 text-primary dark:text-light">{post.title}</h2>
            <p className="text-secondary mb-4">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-auto text-accent hover:underline font-semibold"
            >
              Read More &rarr;
            </Link>
          </div>
        ))}
      </div>

      {/* Related Posts */}
      <div id="related-posts" className="mt-16">
        <h3 className="text-2xl font-bold mb-4 text-primary dark:text-light">Related Posts</h3>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {relatedPosts.map((post) => (
            <div key={post.slug} className="bg-light dark:bg-dark border border-secondary rounded-lg p-4 shadow flex flex-col">
              <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
              <p className="text-secondary mb-2">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-accent hover:underline">
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Author Info */}
      <div id="author-info" className="mt-16 flex flex-col items-center text-center">
        <img
          src={author.avatarUrl}
          alt={author.name}
          className="w-24 h-24 rounded-full mb-4 border-2 border-accent object-cover"
        />
        <h3 className="text-xl font-bold mb-2 text-primary dark:text-light">{author.name}</h3>
        <p className="text-secondary max-w-md">{author.bio}</p>
      </div>
    </section>
  );
}