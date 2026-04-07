"use client";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { signUp, signIn } from "@/lib/actions/auth.action";

import { z } from "zod";

import { Button } from "@/app/components/ui/button";
import { Form } from "@/app/components/ui/form";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        await auth.signOut(); // Sign out to enable fresh sign-in flow

        if (!result.success) {
          console.error("Firestore user profile creation failed:", result.message);
          // We still proceed because the Auth account was created, which is what the user wants to test.
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        const result = await signIn({
          email,
          idToken,
        });

        if (result?.success) {
          toast.success("Signed in successfully.");
          router.push("/");
        } else {
          toast.error(result?.message || "Sign in failed. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      const errorMessage = error.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };
  console.log("type is:", type);

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col items-center gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="./logo.svg" height={32} width={38} alt="logo" />
          <h2 className="text-primary-100">PrepMate</h2>
        </div>
        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            className="w-full space-y-6 mt-4 form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="
           Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="
           Your email address"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="
           Enter Your Password"
              type="password"
            />
            <Button className="btn " type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            className="font-bold text-primary ml-1"
            href={!isSignIn ? "/sign-in" : "/sign-up"}
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
