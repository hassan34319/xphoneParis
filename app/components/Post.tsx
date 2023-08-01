import { User } from "@prisma/client";
import React from "react";
import { Publication } from "../utils/types";
import PostContent from "./PostContent";
import PostCreation from "./PostCreation";

type Props = {
  currentUser: User | null,
  publications : Publication[]
};

function Post({currentUser,publications}: Props) {
  return (
    <div className="flex flex-col items-center justify-center md:w-8/12 mx-auto">
      <PostCreation />
      {publications.map((pub : Publication)=> {
        return (
          <PostContent publication={pub} key={pub._id} currentUser={currentUser}  />
        )
      })}
    </div>
  );
}

export default Post;
