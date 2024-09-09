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
  subcategory? : string 
  brandReal? : string
  categoryReal? : string
  tags: string[];
  desc: string;
  rating : string;
  variants: variant[];
  accessories : accessories[]
  review? : Review[]
};

interface Block {
  _key: string;
  _type: string;
  style: string;
  children: {
    _key: string;
    _type: string;
    text: string;
    marks: string[];
  }[];
}

interface ImageAsset {
  _id: string;
  url: string;
  // Add other image asset fields if needed
}

interface VideoAsset {
    _ref: string;
    _type: string;
  // Add other video asset fields if needed
}

interface Reference {
  _ref : string,
  _type : string
}

export interface Publication {
  _id?: string;
  title: string;
  content: string;
  images: string[]
  video: string[]
  likes?: string[];
  comments?: Comment[];
  _createdAt? : string
  username : string;
  userImage : string | null | undefined;
  approved : boolean;
  buttonText? : string,
  productReference? : Reference;
}

export type scrollingReviews = {
  reviews : string[]
}

export interface Comment {
  _key: string; // Assuming the comment has a unique ID
  user: string; // User who posted the comment (You can use the email or name, etc.)
  content: string; // The content of the comment
  createdAt?: string; 
  status? : string// Timestamp for when the comment was created
  // You can add more fields if needed, like likes, replies, etc.
}