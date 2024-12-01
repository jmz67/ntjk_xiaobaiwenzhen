import React from "react";
import db from "../../../../db";
import { notFound } from "next/navigation";
import MaxWidthWrapper from "../../../components/common/MaxWidthWrapper";
import Chat from "../../../components/Chat";

const page = async ({
  params,
}: {
  params: {
    chatId: string;
  };
}) => {
  const { chatId } = params;

  const chat = await db.conversation.findUnique({
    where: {
      id: chatId,
    },
    select: {
      message: {
        include: {
          improvements: true,
        },
      },
    },
  });

  console.log(chat);

  if (!chat) {
    return notFound();
  }

  return (
    // TODO: 改变滚动条样式
    <MaxWidthWrapper className="bg-background overflow-y-auto custom-scrollbar">
      {/* 外层的网格容器 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 在小屏幕设备上为单列布局，在中等及以上屏幕设备上为12列布局，列间距为6单位 */}

        {/* 第一个网格项目，占据1列（小屏幕）或8列（中等及以上屏幕） */}
        <div className="grid col-span-1 md:col-span-8">
          
          {/* 使用 Chat 组件，并传递初始消息和会话ID作为属性 */}
          <Chat initialMessages={chat?.message || []} conversationId={chatId} />
        
        </div>
      
      </div>
    </MaxWidthWrapper>
  );
};

export default page;



