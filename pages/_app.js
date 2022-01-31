// import "../src/styles/style.scss";
// import "../src/styles/main.scss";
import "../src/styles/main/app.scss";
import Router from 'next/router';
import NProgress from 'nprogress';
import { SessionProvider } from "next-auth/react"; 

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, session }) {
    return <SessionProvider session={session}><Component {...pageProps} /></SessionProvider>
}

export default MyApp

