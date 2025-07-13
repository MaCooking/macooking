import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: 'your_project_id', // Replace with your Sanity project ID
  dataset: 'production',        // Or your dataset name
  apiVersion: '2023-07-12',     // Use current date or your preferred version
  useCdn: true,
});