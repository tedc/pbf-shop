// import "../src/styles/style.scss";
// import "../src/styles/main.scss";
import "../src/styles/main/app.scss";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react"; 

function MyApp({ Component, pageProps, session }) {
    return <SessionProvider session={session}><NextNProgress
  color="#112a4f"
  height={2}
  showOnShallow={true}
  nonce="my-nonce"
/><Component {...pageProps} /></SessionProvider>
}

export default MyApp

