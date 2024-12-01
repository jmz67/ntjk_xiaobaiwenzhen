import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Conversation, Message } from "@prisma/client";

interface ConversationWithMessages extends Conversation {
  message: Message[];
}

const Dashboard = ({
  conversations,
}: {
  conversations: ConversationWithMessages[];
}) => {
  // 当没有对话历史时的提示信息
if (!conversations || conversations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-xl font-semibold text-foreground">
            您还没有任何对话哦！
          </p>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            点击下面的按钮，开始您的第一次咨询吧！
          </p>
          <Link href="/chat" className={buttonVariants()}>
            发起新咨询
          </Link>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8 py-8 mt-24">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">欢迎来到您的控制中心</h1>
          <p className="text-muted-foreground mt-2">
            在这里您可以轻松地发起新的问诊并回顾过去的问诊记录。
          </p>
        </div>
        <Link href="/chat" className={buttonVariants()}>
          开始新问诊
        </Link>
      </div>
      <section className="pt-4">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          最近的问诊
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="hover:shadow-md transition-all duration-300 border hover:border-primary/20"
            >
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">
                  {new Date(conversation.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {conversation.message.length} 条消息
                  </p>
                  <Link
                    href={`/chat/${conversation.id}`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    查看对话
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;