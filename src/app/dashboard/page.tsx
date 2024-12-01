import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import db from "../../../db";
import { redirect } from "next/navigation";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Dashboard from "@/components/Dashboard";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const conversations = await db.conversation.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      message: true,
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return (
    <MaxWidthWrapper>
      <Dashboard 
        conversations={conversations}
      />
    </MaxWidthWrapper>
  );
};

export default page;