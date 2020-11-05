import { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { ThemeProvider, Flex } from 'theme-ui';
import { Global } from '@emotion/core';

import '@reach/dialog/styles.css';
import '@reach/listbox/styles.css';
import '@reach/menu-button/styles.css';
import '@reach/tabs/styles.css';
import '@reach/tooltip/styles.css';
import { fetchJson } from '../lib/utils';
import theme from '../lib/theme';
import Header from '../components/Header';
import Head from 'next/head';
import debug from 'debug';
const vitalslog = debug('govpo:vitals');
import { mixpanelInit } from '../lib/analytics';

export const reportWebVitals = vitalslog;

const MyApp = ({ Component, pageProps }: AppProps) => {
  const dev = process.env.NODE_ENV === 'development';
  mixpanelInit();
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content={
            "default-src 'none';" +
            "font-src 'self';" +
            "connect-src 'self' https: wss:;" +
            "style-src 'self' 'unsafe-inline';" +
            `script-src 'self' ${dev ? "'unsafe-eval'" : ''};` +
            "img-src 'self' https: data:"
          }
        />
      </Head>
      <SWRConfig
        value={{
          refreshInterval: 5000,
          fetcher: url => fetchJson(url)
        }}
      >
        <Global
          styles={{
            '*': {
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }
          }}
        />
        <Flex
          sx={{
            flexDirection: 'column',
            variant: 'layout.root',
            px: [3, 4]
          }}
        >
          <Header />
          <Component {...pageProps} />
        </Flex>
      </SWRConfig>
    </ThemeProvider>
  );
};

export default MyApp;
