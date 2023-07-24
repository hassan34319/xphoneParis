import { User } from "@prisma/client";

export type variant = {
  sub: string;
  price: number;
  capacity: number;
  grade: string;
  color: string;
  image: string;
  quantity: number;
};
export type accessories = {
  title:string
  image: string;
};
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export interface NavbarProps {
  currentUser?: SafeUser | null;
}
export interface Review {
  _id: string;
  user: string;
  rating: number;
  reviewText: string;
  date: string;
  status: string;
  images : string[]
}

export type product = {
  _id?: string;
  name: string;
  brand: string;
  category: string;
  tags: string[];
  desc: string;
  variants: variant[];
  accessories : accessories[]
  reviews : Review[]
};
