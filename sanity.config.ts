import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  name: 'default',
  title: 'Ahmed Ayon Portfolio',
  projectId: process.env.SANITY_PROJECT_ID || 'ap6jnhid',
  dataset: process.env.SANITY_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: [
      {
        name: 'blogPost',
        type: 'document',
        title: 'Blog Post',
        fields: [
          { name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() },
          { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (Rule) => Rule.required() },
          { name: 'excerpt', type: 'text', title: 'Excerpt' },
          { name: 'category', type: 'string', title: 'Category', options: { list: [{ title: 'Blog', value: 'blog' }, { title: 'Case Study', value: 'case-study' }, { title: 'Video', value: 'video' }] }, initialValue: 'blog' },
          { name: 'url', type: 'url', title: 'URL' },
          { name: 'youtubeId', type: 'string', title: 'YouTube ID' },
          { name: 'publishedAt', type: 'datetime', title: 'Published At' }
        ]
      },
      {
        name: 'caseStudy',
        type: 'document',
        title: 'Case Study',
        fields: [
          { name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() },
          { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (Rule) => Rule.required() },
          { name: 'excerpt', type: 'text', title: 'Excerpt' },
          { name: 'category', type: 'string', title: 'Category', initialValue: 'case-study', readOnly: true },
          { name: 'url', type: 'url', title: 'URL' },
          { name: 'publishedAt', type: 'datetime', title: 'Published At' }
        ]
      },
      {
        name: 'portfolioItem',
        type: 'document',
        title: 'Portfolio Item',
        fields: [
          { name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() },
          { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (Rule) => Rule.required() },
          { name: 'excerpt', type: 'text', title: 'Excerpt' },
          { name: 'category', type: 'string', title: 'Category', initialValue: 'video', readOnly: true },
          { name: 'youtubeId', type: 'string', title: 'YouTube ID' },
          { name: 'url', type: 'url', title: 'URL' },
          { name: 'publishedAt', type: 'datetime', title: 'Published At' }
        ]
      },
      {
        name: 'testimonial',
        type: 'document',
        title: 'Testimonial',
        fields: [
          { name: 'name', type: 'string', title: 'Client Name', validation: (Rule) => Rule.required() },
          { name: 'role', type: 'string', title: 'Client Role' },
          { name: 'quote', type: 'text', title: 'Quote', validation: (Rule) => Rule.required() },
          { name: 'publishedAt', type: 'datetime', title: 'Published At' }
        ]
      }
    ]
  }
});
