import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Menu } from "lucide-react"

const navigation = [
    {
        name: "主页",
        href: "/"
    },
    {
        name: "控制面板",
        href: "/dashboard"
    }
]

const Navbar = async () => {

    const { isAuthenticated } = getKindeServerSession()
    const authenticated = await isAuthenticated()



  return (
    <MaxWidthWrapper
    className="fixed top-0 w-full z-50 right-0 left-0 bg-background/80 backdrop-blur-md shadow-sm">

        <nav className="container mx-auto px-4">

            <div className="flex items-center justify-between h-16 md:h-20 ">

                <Link href="/" className="font-bold">
                    Nt<span className="text-indigo-700">Health</span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {
                    authenticated ? (
                        <LogoutLink>退出登录</LogoutLink>
                    ):(
                        <div 
                        className="hidden md:flex items-center space-x-4"
                        >

                            <LoginLink
                            className={buttonVariants({
                                variant: "ghost"
                            })}
                            >
                                登录
                            </LoginLink>

                            <RegisterLink
                            className={
                                buttonVariants({
                                    className: "bg-primary text-primary-foreground hover:bg-primary/90"
                                })
                            }>
                                注册
                            </RegisterLink>

                        </div>
                    )
                }

                <div className="md:hidden">
                    <Sheet> 
                        <SheetTitle className="font-bold">NtHealth</SheetTitle>
                        <SheetTrigger asChild>
                            <Button
                                variant={"ghost"}
                                size={"icon"}>
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side={"right"}
                            className="w-[300px] sm:w-[400px]"
                        >
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex flex-col space-y-4 pt-4 border-t border-border">
                                <LoginLink
                                    className={buttonVariants({
                                        variant: "ghost"
                                    })}
                                >
                                    登录    
                                </LoginLink>
                                <RegisterLink
                                    className={buttonVariants({
                                        className: "bg-primary text-primary-foreground hover:bg-primary/90"
                                    })}
                                >
                                    注册
                                </RegisterLink>
                            </div>
                        </SheetContent>

                    </Sheet>
                </div>

            </div>
        </nav>

    </MaxWidthWrapper>
  )
}

export default Navbar
