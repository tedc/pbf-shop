import Head from "next/head";
import { AppProvider } from "./context/AppContext";
import Nav from "./Nav";
import Footer from "./Footer";
import client from "./ApolloClient";
import Router from "next/router";
import NProgress from "nprogress";
import { ApolloProvider } from "@apollo/client";
import { Fonts } from "./commons/Fonts";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const FontLink = ({font})=> {
    return (
        <>
            <link
                rel="preload"
                href={`/fonts/${font.name}.woff2`}
                as="font"
                crossOrigin=""
              />
            <link
                rel="preload"
                href={`/fonts/${font.name}.woff`}
                as="font"
                crossOrigin=""
              />
        </>
    )
}

const Layout = (props) => {
  return (
    <AppProvider>
      <ApolloProvider client={client}>
        <Head>
            <title>Professional By Fama Shop</title>
            <>
            {
                Fonts.map((font) => (
                    <FontLink key="{font}" font={font} />
                ))
            }
            </>
          </Head>
          <Nav {...props}/>
          { props.children }
          <Footer {...props} />
      </ApolloProvider>
    </AppProvider>
  );
};

export default Layout;
