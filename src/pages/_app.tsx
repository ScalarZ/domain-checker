import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { NextSeo } from "next-seo";
import type { AppProps } from "next/app";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title="Domain Checker"
        description="A web app that checks for domain availability"
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        strategy="afterInteractive"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-6SET1C2WFD"
      ></Script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-6SET1C2WFD');
        `}
      </Script>
    </>
  );
}
