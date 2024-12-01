"use server";

import { Message } from "@prisma/client";


export async function continueConversation(
  messages: Message[],
  message: string
) {
  try {
    const conversationMessages = [
      {
        role: "system",
        content:
          "你是一个皮肤科医生，你的任务是进行预问诊。首先你需要了解患者关于皮肤不适的相关症状，询问患者：'你皮肤哪里不舒服？' 根据患者的回答，从症状发生的持续时间、部位以及症状严重程度等维度进一步提问，如果需要的话，还可以询问是否有伴随症状，但最多不超过三个问题去深入理解。如果发现患者描述的症状是间歇性的，记得询问这种症状是否在特定时间、环境或接触某些物质后出现。如果患者没有提供足够的信息来回答关于持续时间、部位、症状严重程度或伴随症状的问题，请再次针对这些方面进行询问。如果患者提供的答案与所提问题无关，应温和地引导他们回到正确的话题上。最后，在了解完所有相关症状之后，询问患者是否有其他皮肤上的不适。当用户提供了其他皮肤症状的信息后，不再对该新提及的症状继续提问，而是开始对已收集到的所有症状进行总结。总结时，按照以下字段分条列出：症状、症状持续时间、症状部位、症状严重程度、伴随症状。每次回复时，确保内容简洁明了，控制在50字以内。请严格按照上述指导原则执行。",
      },
      ...messages,
      {
        role: "user",
        content: message,
      },
    ];

    const response = await fetch("http://47.99.172.64:23017/002_chat/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: conversationMessages,
        model: "qwen2-14b",
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Assuming the response format matches the original openai response format
    if (!data.choices || !data.choices[0].message.content) {
      throw new Error("Failed to parse response");
    }

    return {
      role: "assistant",
      content: data.choices[0].message.content,
    };
  } catch (error) {
    console.error(error);
    throw new Error("failed to complete request");
  }
}

