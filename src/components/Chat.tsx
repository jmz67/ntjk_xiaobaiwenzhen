"use client";

import { Message } from "@prisma/client"; // 从Prisma导入Message类型，用于定义消息的数据结构。
import { useState, useEffect, useRef } from "react"; // 导入React的状态管理hook和useRef hook。
import { AnimatePresence, motion } from "framer-motion"; // 用于创建动画效果的库。
import { Badge } from "./ui/badge"; // 自定义UI组件：徽章，用来展示一个简单的标签。
import { Card, CardContent } from "./ui/card"; // 自定义UI组件：卡片，用来包裹内容。
import { cn } from "@/lib/utils"; // 导入一个用于类名合并的工具函数，便于CSS类名处理。
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // 自定义UI组件：头像，显示用户或AI的图像。
import { Separator } from "./ui/separator"; // 自定义UI组件：分割线，用于视觉上分隔内容。
import { Input } from "./ui/input"; // 自定义UI组件：输入框，供用户输入文本。
import { Button } from "./ui/button"; // 自定义UI组件：按钮，触发事件。
import { Send } from "lucide-react"; // 图标库中的发送图标，用作按钮内的图标。
import { sendMessageToDB } from "@/utils/db"; // 与数据库交互的函数，用于保存消息。
import { continueConversation } from "@/utils/ai"; // 与AI服务交互以继续对话的函数，获取AI回复。

// 定义Chat组件，接收初始消息列表和对话ID作为属性
const Chat = ({
  initialMessages, // 初始消息列表
  conversationId, // 当前对话的ID
}: {
  initialMessages: Message[];
  conversationId: string;
}) => {
  const [message, setMessage] = useState<string>(""); // 管理用户输入的消息。
  const [messages, setMessages] = useState<Message[]>(initialMessages); // 管理当前会话中的消息列表。
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // 是否正在处理消息。
  const [isTyping, setIsTyping] = useState<boolean>(false); // AI是否正在“打字”。

  // 使用useRef来创建一个引用，指向消息列表的最后一个元素
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 使用useEffect监听messages的变化，在变化时自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 处理回车键事件，当按下回车且消息不为空时调用sendMessage
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim()) {
      sendMessage();
    }
  };

  // 发送消息到数据库并处理AI响应
  const sendMessage = async () => {
    if (!message.trim() || isProcessing) return; // 如果没有消息或正在处理，则返回。
    setIsProcessing(true);
    setIsTyping(true);
    const currentMessage = message.trim();
    setMessage(""); // 清空输入框

    try {
      // 创建用户消息对象
      const userMessage = {
        content: currentMessage,
        role: "user",
        id: `temp-${Date.now()}`, // 临时ID
        conversationId,
        createdAt: new Date(),
      } as Message;

      // 更新消息列表，添加用户消息
      setMessages((prev) => [...prev, userMessage]);

      // 如果AI正在“打字”，则添加打字指示器
      if (isTyping) {
        setMessages((prev) => [
          ...prev,
          {
            content: "...", // 打字指示器的内容
            role: "assistant",
            id: "typing-indicator", // 打字指示器的唯一ID
            conversationId,
            createdAt: new Date(),
          } as Message,
        ]);
      }

      // 将当前消息发送到数据库
      const [newMessage] = await Promise.all([
        sendMessageToDB(currentMessage, conversationId, "user")
      ]);

      if (!newMessage) return; // 如果没有得到新消息则返回

      // 更新消息列表，移除临时用户消息并添加正式的新消息
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== userMessage.id);
        return [...filtered, newMessage];
      });

      // 获取AI响应
      const aiResponse = await continueConversation(
        [...messages, newMessage], // 包含最新消息的消息列表
        currentMessage // 用户发送的消息内容
      );
      if (!aiResponse) return; // 如果没有AI响应则返回

      // 将AI响应发送到数据库
      const newAiMessage = await sendMessageToDB(
        aiResponse.content, // AI响应的内容
        conversationId,
        "assistant" // 设置角色为助手
      );

      if (!newAiMessage) return; // 如果没有得到新的AI消息则返回

      // 更新消息列表，移除打字指示器并添加AI消息
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== "typing-indicator");
        return [...filtered, newAiMessage];
      });
    } catch (error) {
      // 错误处理
      console.error("Error sending message:", error); // 记录错误信息
      // 移除打字指示器
      setMessages((prev) => prev.filter((m) => m.id !== "typing-indicator"));
    } finally {
      // 结束处理状态
      setIsProcessing(false);
      setIsTyping(false);
    }
  };

  // 返回JSX元素
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* 动画效果 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* 徽章组件 */}
        <Badge variant={"default"} className="w-32 flex justify-center">
          皮肤病预问诊
        </Badge>
        <h1 className="text-4xl font-bold text-foreground mb-2 mt-2">
          Conversation
        </h1>
        <p className="text-muted-foreground">
          在这里我将向您提问一系列皮肤问题，询问您的基本情况
          <br />
          请您如实回答，以便我为您提供专业的皮肤疾病预防和治疗方案。
        </p>
      </motion.div>
      {/* 卡片组件 */}
      <Card className="mb-4">
        <CardContent className="p-4"> {/* 减少内边距 */}
          {/* 对话内容区域 */}
          <motion.div
            className="space-y-2 mb-4 min-h-[300px] max-h-[350px] overflow-y-auto custom-scrollbar relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence>
              {/* 映射消息列表为JSX */}
              {messages.map((msg) => (
                <motion.div
                  layout
                  key={msg.id}
                  layoutId={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "flex items-start gap-4", // 增加间隔
                    msg.role === "user" && "flex-row-reverse", // 如果是用户消息，反转行方向
                    "pl-4 pr-8" // 增加左侧和右侧内边距
                  )}
                >
                  {/* 头像组件 */}
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        msg.role === "assistant"
                          ? "/user-avatar.jpg"
                          : "/user-avatar.jpg"
                      }
                    />
                    <AvatarFallback>
                      {msg.role === "assistant" ? "A" : "I"}
                    </AvatarFallback>
                  </Avatar>
                  {/* 消息内容 */}
                  <div
                    className={cn(
                      "rounded-lg p-2 max-w-[70%]", // 减少内边距
                      msg.role === "assistant"
                        ? "bg-accent/10 text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {/* 引用最后一个消息元素以便自动滚动到底部 */}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </motion.div>
          {/* 分割线 */}
          <Separator className="my-2" /> {/* 减少上下外边距 */}
          {/* 输入区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-2" // 减少间隔
          >
            <div className="flex-1 flex gap-2"> {/* 减少间隔 */}
              {/* 输入框 */}
              <Input
                placeholder={
                  isProcessing
                    ? "Waiting for response..."
                    : "Type your message.."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
                disabled={isProcessing}
              />
              {/* 发送按钮 */}
              <Button
                className="shrink-0"
                onClick={sendMessage}
                disabled={!message.trim() || isProcessing}
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-5 w-5"
                  >
                    ⭮
                  </motion.div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;



