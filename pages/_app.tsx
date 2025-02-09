import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Jokerou - Le jeu de cache-cache urbain</title>
        <meta name="description" content="Jokerou - Un jeu de cache-cache en temps réel dans votre ville" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
} 