"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { IoReload } from "react-icons/io5";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-succes";

import React from "react";
import { login } from "@/actions/auth";

export function LoginForm() {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((data) => {
        setError(data?.error);
        // setSuccess(data?.success);
      });
    });
  };
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Connexion</h1>
            <p className="text-balance text-muted-foreground">
              Saisissez votre adresse e-mail ci-dessous pour vous connecter à
              votre compte.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Email</Label>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            id="email"
                            type="email"
                            placeholder="flovis@example.com"
                          />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Label>Mot de passe</Label>
                          <Link
                            href="/forgot-password"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Mot de passe oublié?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            id="password"
                            type="password"
                            placeholder=""
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <IoReload className="h-4 w-4 animate-spin" />
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Vous n&apos;avez pas de compte?{" "}
                <Link href="#" className="underline">
                  Inscrivez-vous.
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
