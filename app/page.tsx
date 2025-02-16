import { NextPage } from "next";
import Carousel from "./components/Carousel";
import Categories2 from "./components/Categories2";
import Values from "./components/Values";
import Categories from "./components/Categories";
import Layout from "./components/Layout";
import { product,scrollingReviews } from "./utils/types";
import { sanityClient } from "../lib/sanityClient";
import SubscribeCard from "./components/SubscribeCard";
import Post from "./components/Post";
import getCurrentUser from "./utils/getCurrentUser";
import ScrollingReviews from "./components/ScrollingReviews";

type Props = {};

async function Home({}: Props) {
  const phonesQuery = '*[_type == "product" && category == "smartphone"] | order(name desc)';

  const audioQuery = '*[_type == "product" && category == "audio"]';
  const jeuxVideoQuery = '*[_type == "product" && category == "jeuxVideo"]';
  const televisionsQuery = '*[_type == "product" && category == "television"]';
  const tabletsQuery = '*[_type == "product" && category == "tablet"]';
  const computersQuery = '*[_type == "product" && category == "computer"]';
  const bannerQuery = `*[_type == "banner"]`;
  const scrollingReviewsQuery = `*[_type == "scrollingReviews"]`;
  const exclusiveQuery = `*[_type == 'product' && defined(priority)] | order(priority asc)`
  const banners = await sanityClient.fetch(bannerQuery);
  console.log(banners);
  const phones: product[] = await sanityClient.fetch(phonesQuery);
  const televisions: product[] = await sanityClient.fetch(televisionsQuery);
  const audio: product[] = await sanityClient.fetch(audioQuery);
  const jeuxVideo: product[] = await sanityClient.fetch(jeuxVideoQuery);
  const tablets: product[] = await sanityClient.fetch(tabletsQuery);
  const computers: product[] = await sanityClient.fetch(computersQuery);
  const exclusive: product[] = await sanityClient.fetch(exclusiveQuery);
  const scrollingReviews : scrollingReviews[] = await sanityClient.fetch(scrollingReviewsQuery)
  const query = `*[_type == 'publication'] {
    _id,
    title,
    content,
    images,
    video,
    likes,
    comments,
    _createdAt,
    username,
    userImage,
    approved,
    buttonText,
    productReference
  }`;
  const publications = await sanityClient.fetch(query);
  console.log(publications)
  const currentUser = await getCurrentUser();
  const shuffledReviews =
  scrollingReviews.length > 0 && scrollingReviews[0].reviews
    ? [...scrollingReviews[0].reviews].sort(() => Math.random() - 0.5)
    : [];

  return (
    <div className="h-full mb-10">
      <Carousel Banners={banners} />
    <ScrollingReviews scrollingReviews={shuffledReviews}/>
      <section id="bon-plans" className="flex flex-col">
        {/* <section id="bon-plans"> */}
        <Categories2
          phones={phones}
          televisions={televisions}
          tablets={tablets}
          computers={computers}
          exclusive={exclusive}
          audio={audio}
          jeuxVideo={jeuxVideo}

        />
        </section>
        {/* </section> */}
        <section id="all-products" className="flex flex-col">
        <Categories />
        </section>
      {/* <Post publications={publications} currentUser={currentUser} /> */}

      <SubscribeCard />
      <Values />
    </div>
  );
}

export default Home;

