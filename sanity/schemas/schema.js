import createSchema from "part:@sanity/base/schema-creator";
import schemaTypes from "all:part:@sanity/base/schema-type";
import product from "./product";
import variant from "./variant";
import code from "./code"
import categoryReal from "./categoryReal";
import brandReal from "./brandReal";
import accessories from "./accessories";
import comment from "./comment";
import publication from "./publication";
import review from "./review";
import banner from "./banner";
import subcategory from "./subcategory"
import scrollingReviews from "./scrollingReview"
import menuCategory from "./menuCategory"
import xphones from "./quiSommes";
import quiSommes from "./quiSommes";
import nosmagsin from "./nosmagsin";
import contactPage from "./contactPage";
import qualityPage from "./qualityPage";
import grades from "./grades";
import post from "./post";
export default createSchema({
  name: "default",
  types: schemaTypes.concat([product, variant,code,categoryReal,brandReal, accessories,banner,publication,comment,review,subcategory,scrollingReviews, menuCategory, quiSommes, nosmagsin, contactPage, qualityPage,grades, post ]),
});
