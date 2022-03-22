import Head from "next/head";
import { AppProvider } from "./context/AppContext";
import Nav from "./Nav";
import Footer from "./Footer";
import client from "./ApolloClient";
import { ApolloProvider } from "@apollo/client";
import { Fonts } from "./commons/Fonts";
import Banner from "./Banner";

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
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
            <meta name="apple-mobile-web-app-title" content="Snippit"/>
            <meta name="application-name" content="<APP NAME>"/>
            <meta name="msapplication-TileColor" content="#ffc40d"/>
            <meta name="theme-color" content="#ffffff"/>
            <>
            {
                Fonts.map((font) => (
                    <FontLink key="{font}" font={font} />
                ))
            }
            </>
          </Head>
          <Banner />
          <Nav {...props}/>
          { props.children }
          <Footer {...props} />
      </ApolloProvider>
    </AppProvider>
  );
};

export default Layout;
