import { SignIn } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to your account to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none border-0",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    socialButtonsBlockButton: "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                                    socialButtonsBlockButtonText: "text-foreground",
                                    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                                    formFieldInput: "bg-background border-input",
                                    footerActionLink: "text-primary hover:text-primary/90",
                                    identityPreviewText: "text-foreground",
                                    identityPreviewEditButton: "text-primary hover:text-primary/90",
                                    formFieldLabel: "text-foreground",
                                    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
                                    formResendCodeLink: "text-primary hover:text-primary/90",
                                    otpCodeFieldInput: "bg-background border-input",
                                    formFieldErrorText: "text-destructive",
                                    alertClerkError: "text-destructive",
                                    dividerLine: "bg-border",
                                    dividerText: "text-muted-foreground",
                                    formFieldSuccessText: "text-green-600",
                                    formHeaderTitle: "text-foreground",
                                    formHeaderSubtitle: "text-muted-foreground",
                                    modalCloseButton: "text-muted-foreground hover:text-foreground",
                                    navbarButton: "text-muted-foreground hover:text-foreground"
                                }
                            }}
                            signUpUrl="/sign-up"
                            redirectUrl="/"
                            routing="path"
                            path="/sign-in"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 