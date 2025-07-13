import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMeta } from './types';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDirectory);
  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      title: data.title,
      slug,
      date: data.date,
      excerpt: data.excerpt,
    };
  });
}

export function getPostBySlug(slug: string): Post {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    title: data.title,
    slug,
    date: data.date,
    excerpt: data.excerpt,
    content,
  };
}
