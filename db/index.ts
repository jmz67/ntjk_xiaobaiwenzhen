// 从 @prisma/client 包中导入 PrismaClient 类
import { PrismaClient } from "@prisma/client";

// 扩展全局命名空间，声明一个全局变量 cachedPrisma，类型为 PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

// 定义一个局部变量 prisma，类型为 PrismaClient
let prisma: PrismaClient;

// 检查当前环境是否为生产环境
if (process.env.NODE_ENV === 'production') {
  // 如果是生产环境，直接创建一个新的 PrismaClient 实例
  prisma = new PrismaClient();
} else {
  // 如果不是生产环境（即开发或测试环境）
  if (!global.cachedPrisma) {
    // 如果全局变量 cachedPrisma 不存在，则创建一个新的 PrismaClient 实例并赋值给它
    global.cachedPrisma = new PrismaClient();
  }
  // 将全局变量 cachedPrisma 赋值给局部变量 prisma
  prisma = global.cachedPrisma;
}

// 导出 prisma 实例，以便在其他地方使用
export default prisma;