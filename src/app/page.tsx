import MaxWidthWrapper from "@/components/common/MaxWidthWrapper"; // 导入自定义的宽度限制组件
import { Badge } from "@/components/ui/badge"; // 导入徽章组件
import { Button } from "@/components/ui/button"; // 导入按钮组件
import Image from "next/image"; // 导入Next.js的Image组件

export default function Home() {
  return (
    <MaxWidthWrapper
      className="overflow-x-hidden mt-8 md:mt-12" // 设置最大宽度容器，并隐藏水平滚动条；不同屏幕尺寸下设置不同的顶部边距
    >
      <section className="relative"> {/* 设置相对定位 */}
        <div className="hidden sm:block absolute top-0 right-0 w-2/3 h-full bg-white transform skew-x-12 translate-x-32 sm:translate-x-20 z-0" /> {/* 在小屏设备上隐藏，大屏设备显示；设置绝对定位、倾斜效果和背景颜色；设置z-index为0以确保其在其他元素下方 */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10"> {/* 设置响应式内边距，以及相对于父元素的位置；设置z-index为10以确保其位于上方 */}
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8"> {/* 定义一个弹性布局，根据屏幕大小调整方向；设置项目之间的间距 */}
            <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left"> {/* 定义宽度，在大屏设备上减少宽度；设置垂直间距；文本居中或左对齐 */}
              <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 inline-flex"> {/* 徽章样式：背景色、文字颜色及悬停时的变化 */}
                人工智能预问诊系统
              </Badge>
              
              <h2 className="font-bold text-indigo-900 leading-tight"> {/* 加粗字体，深靛蓝色文字，紧凑的行高 */}
                <span className="text-2xl sm:text-2xl md:text-4xl lg:text-3xl block">宁唐健康</span> {/* 文字大小随屏幕变化而变化 */}
                <span className="relative block mt-2"> {/* 相对于自身位置，设置顶部间距 */}
                  <span className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-7xl">小白问诊</span> {/* 文字大小随屏幕变化而变化，设置z-index为10使其位于上方 */}
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-orange-500/20 -rotate-1" /> {/* 设置绝对定位，底部距离2单位，橙色背景，轻微旋转 */}
                </span>
              </h2>

              <p className="text-base sm:text-lg text-gray-700 w-full md:max-w-md mx-auto md:mx-0"> {/* 基础字体大小，灰度文本颜色，自动居中，大屏设备上限制最大宽度 */}
                人工智能赋能医疗问诊
                <br />
                便民便医，助力全民健康！
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start"> {/* 弹性布局，根据屏幕大小调整方向；设置项目间的间距；居中对齐或左对齐 */}
                <Button
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-lg"> {/* 按钮样式：全宽到自动宽度，背景色，悬停时的颜色变化，放大效果，过渡动画，阴影 */}
                  现在开始问诊吧！
                </Button>

                <Button
                  variant={"ghost"}
                  className="w-full sm:w-auto text-indigo-700 hover:text-indigo-800 hover:bg-transparent"> {/* 幽灵按钮样式：全宽到自动宽度，文字颜色，悬停时的文字颜色变化，透明背景 */}
                  <div
                    className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mr-2"> {/* 圆形图标，白色背景，阴影，居中内容，右侧间距 */}
                    ▶️
                  </div>
                  See how it works
                </Button>
              </div>

            </div>

            <Image 
              src="/medi2.jpg"
              alt="aimedchatbot"
              width={200}
              height={200}
              className="relative z-10 rounded-2xl shadow-2xl transform hover:rotate-2 transition-transform duration-300 w-full" 
              /* 图片样式：相对定位，z-index为10，圆角，阴影，悬停时轻微旋转，过渡动画，占满宽度 */
            />

          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}