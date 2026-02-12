import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL, SITE_NAME } from "@/constants/site";
import { computePlumBlossom } from "@/lib/plumBlossomComputer";
import { hashCosmology, hashReasoning } from "@/lib/oracleHash";
import { routing } from "@/i18n/routing";
import PlumBlossomClient from "./PlumBlossomClient";

interface PlumBlossomPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export const revalidate = 604800;

export async function generateMetadata({ params }: PlumBlossomPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PlumBlossom" });

  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("description");
  const pageUrl = `${SITE_URL}/${locale}/plum-blossom`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${SITE_URL}/en/plum-blossom`,
        zh: `${SITE_URL}/zh/plum-blossom`,
        "x-default": `${SITE_URL}/en/plum-blossom`,
      },
    },
  };
}

export default async function PlumBlossomPage({ params }: PlumBlossomPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const initialResult = computePlumBlossom({ date: new Date() });
  const serializedResult = JSON.parse(JSON.stringify(initialResult));
  const initialHashes = {
    cosmologyHash: hashCosmology(initialResult.cosmology),
    reasoningHash: hashReasoning(initialResult.reasoning),
  };

  return <PlumBlossomClient initialResult={serializedResult} initialHashes={initialHashes} />;
}
