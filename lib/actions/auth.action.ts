"use server";
import { db, auth } from "@/firebase/admin";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000, // milliseconds
    });

    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });

    console.log("Session cookie set successfully.");
}

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        // check if user exists in db
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists)
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };

        // save user to db
        await db.collection("users").doc(uid).set({
            name,
            email,
            // profileURL,
            // resumeURL,
        });

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (error: any) {
        console.error("Error in signUp action:", error);

        // Handle Firebase specific errors
        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use",
            };
        }

        return {
            success: false,
            message: error.message || "Failed to create account. Please try again.",
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord)
            return {
                success: false,
                message: "User does not exist. Create an account.",
            };

        await setSessionCookie(idToken);
        console.log(`User ${email} signed in successfully.`);

        // Ensure user exists in Firestore to prevent redirect loop in layout
        const firestoreUser = await db.collection("users").doc(userRecord.uid).get();
        if (!firestoreUser.exists) {
            console.log(`Creating missing Firestore record for user: ${email}`);
            await db.collection("users").doc(userRecord.uid).set({
                email,
                name: email.split("@")[0], // Fallback name
            });
        }
    } catch (error: any) {
        console.error("Error in signIn action:", error);

        return {
            success: false,
            message: error.message || "Failed to log into account. Please try again.",
        };
    }

    redirect("/");
}


// Get current user from session cookie
// export async function getCurrentUser(): Promise<User | null> {
//     const cookieStore = await cookies();

//     const sessionCookie = cookieStore.get("session")?.value;
//     if (!sessionCookie) {
//         console.log("No session cookie found in getCurrentUser");
//         return null;
//     }

//     try {
//         const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
//         console.log("Session cookie decoded successfully for UID:", decodedClaims.uid);

//         // get user info from db
//         const userRecord = await db
//             .collection("users")
//             .doc(decodedClaims.uid)
//             .get();
//         if (!userRecord.exists) {
//             console.log("User record not found in Firestore for UID:", decodedClaims.uid);
//             return null;
//         }

//         console.log("User record found in Firestore.");
//         return {
//             ...userRecord.data(),
//             id: userRecord.id,
//         } as User;
//     } catch (error) {
//         console.log("Error verifying session cookie or fetching user:", error);

//         // Invalid or expired session
//         return null;
//     }
// }

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    console.log("=== getCurrentUser called ===");
    console.log("Session cookie exists:", !!sessionCookie);
    console.log("Session cookie value (first 20 chars):", sessionCookie?.substring(0, 20));

    if (!sessionCookie) {
        console.log("No session cookie found");
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        console.log("✅ Cookie verified for UID:", decodedClaims.uid);

        const userRecord = await db.collection("users").doc(decodedClaims.uid).get();
        console.log("Firestore user exists:", userRecord.exists);

        if (!userRecord.exists) return null;

        return { ...userRecord.data(), id: userRecord.id } as User;
    } catch (error) {
        console.log("❌ verifySessionCookie failed:", error);
        return null;
    }
}

// Check if user is authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}