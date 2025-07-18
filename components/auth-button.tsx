'use client'

import { useAuth, useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { LogIn, UserPlus, Settings } from 'lucide-react'
import Link from 'next/link'
//import { Badge } from '@/components/ui/badge'

export default function AuthButton() {
    const { isSignedIn } = useAuth()
    const { user } = useUser()

    if (isSignedIn) {
        return (
            <div className="flex items-center gap-3">
                {/* User role badge - temporarily removed due to type issues */}

                {/* User profile button with dashboard link */}
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "w-8 h-8",
                            userButtonPopoverCard: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-[9999]",
                            userButtonPopoverActionButton: "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 px-3 py-2",
                            userButtonPopoverActionButtonText: "text-gray-900 dark:text-gray-100 font-medium text-sm",
                            userButtonPopoverActionButtonIcon: "text-gray-900 dark:text-gray-100 w-4 h-4",
                            userButtonPopoverFooter: "hidden",
                            userPreviewTextContainer: "bg-whitetext-gray-900 dark:text-gray-100",
                            userPreviewSecondaryIdentifier: "text-gray-600 dark:text-gray-400",
                            userButtonPopoverMain: "bg-white dark:bg-gray-800",
                            userButtonPopoverActions: "bg-white dark:bg-gray-800",
                            userButtonPopover: "z-[9999]",
                            userButtonPopoverActionButtonIconBox: "text-gray-900 dark:text-gray-100",
                        }
                    }}
                    userProfileProps={{
                        appearance: {
                            elements: {
                                rootBox: "bg-background z-[9999]",
                                card: "bg-background border-border",
                                headerTitle: "text-foreground",
                                headerSubtitle: "text-muted-foreground",
                                socialButtonsBlockButton: "border-input bg-background hover:bg-accent",
                                formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                                formFieldInput: "bg-background border-input",
                                footerActionLink: "text-primary hover:text-primary/90"
                            }
                        }
                    }}
                />

                {/* Dashboard link */}
                <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Settings className="w-4 h-4" />
                        Dashboard
                    </Button>
                </Link>

                {/* Admin functionality is now integrated into the dashboard */}
            </div>
        )
    }

    return (
        <SignedOut>
            <div className="flex items-center gap-2">
                <Link href="/sign-in">
                    <Button variant="outline" size="sm" className="gap-2">
                        <LogIn className="w-4 h-4" />
                        Sign In
                    </Button>
                </Link>
                <Link href="/sign-up">
                    <Button size="sm" className="gap-2">
                        <UserPlus className="w-4 h-4" />
                        Sign Up
                    </Button>
                </Link>
            </div>
        </SignedOut>
    )
} 