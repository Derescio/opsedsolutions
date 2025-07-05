"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const cycleTheme = () => {
        if (theme === "light") {
            setTheme("dark")
        } else if (theme === "dark") {
            setTheme("system")
        } else {
            setTheme("light")
        }
    }

    const getIcon = () => {
        switch (theme) {
            case "light":
                return <Sun className="h-[1.2rem] w-[1.2rem]" />
            case "dark":
                return <Moon className="h-[1.2rem] w-[1.2rem]" />
            default:
                return <Monitor className="h-[1.2rem] w-[1.2rem]" />
        }
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={cycleTheme}
            className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 dark:bg-gray-900"
            title={`Current theme: ${theme}. Click to cycle themes.`}
        >
            {getIcon()}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
} 