export interface PostMeta {
  title: string;
  slug: string;
  excerpt: string;
}

export interface Post extends PostMeta {
  content: string;
}