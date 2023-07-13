import { NextPage } from "next";
import Carousel from "./components/Carousel";
import Categories2 from "./components/Categories2";
import Values from "./components/Values";
import Categories from "./components/Categories";
import Layout from "./components/Layout";
import { product } from "./utils/types";
import { sanityClient } from "../lib/sanityClient";

type Props = {}

async function Home({}: Props) {
  const phonesQuery = '*[_type == "product" && category == "smartphone"]';
  const televisionsQuery = '*[_type == "product" && category == "television"]';
  const tabletsQuery = '*[_type == "product" && category == "tablet"]';
  const computersQuery = '*[_type == "product" && category == "computer"]';
  const phones: product[] = await sanityClient.fetch(phonesQuery);
  const televisions: product[] = await sanityClient.fetch(televisionsQuery);
  const tablets: product[] = await sanityClient.fetch(tabletsQuery);
  const computers: product[] = await sanityClient.fetch(computersQuery);
  return (
    <div>
      <Carousel />
      <h1 className="text-xl md:text-3xl text-center my-4">
        « La meilleure boutique d&apos;électronique de Paris, rien de plus, rien
        de moins... »
      </h1>
      <h2 className="text-slate-800 text-center text-base md:text-2xl">
        Marie S.
      </h2>
      <div className="flex flex-col">
        <Categories2 phones={phones} televisions={televisions} tablets={tablets} computers={computers} />
        <Categories />
      </div>
      <Values />
    </div>
  );
};

export default Home;
