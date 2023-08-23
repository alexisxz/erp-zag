"use client";
import Login from "@/components/Login";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>COMPANY ERP</title>
        <meta
          name="description"
          content="Generated by Alexis Silva"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!user ? <Login /> : router.push("/panel")}
    </>
  );
}
