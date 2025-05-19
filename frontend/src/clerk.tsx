import { ClerkProvider } from "@clerk/clerk-react";

export const WithClerk = ({ children }: { children: React.ReactNode }) => (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        {children}
    </ClerkProvider>
)