import { defineConfig } from 'sanity';
import schemaTypes from 'all:part:@sanity/base/schema-type';
import product from './schemas/product';
import variant from './schemas/variant';
import code from './schemas/code';
import categoryReal from './schemas/categoryReal';
import brandReal from './schemas/brandReal';
import accessories from './schemas/accessories';
import comment from './schemas/comment';
import publication from './schemas/publication';
import review from './schemas/review';
import banner from './schemas/banner';
import subcategory from './schemas/subcategory';
import scrollingReviews from './schemas/scrollingReview';
import menuCategory from './schemas/menuCategory';

export default defineConfig({
  name: 'default',
  title: 'My Sanity Project',
  projectId: 'onzgpdr3', // Replace with your project ID
  dataset: 'production',
  plugins: [
    // Add any plugins if needed
  ],
  schema: {
    types: schemaTypes.concat([
      product, variant, code, categoryReal, brandReal, accessories,
      comment, publication, review, banner, subcategory, scrollingReviews, menuCategory
    ]),
  },
});
