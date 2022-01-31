import Head from "next/head";
import Blocks from './Blocks';
import Seo from './seo';
import Content from './Content';
export default function Page(props) {
    return (
        <>
        <Seo seo={props.seo} uri={props.uri} />
        {
            props.template !== 'Servizio' ? (
                <Blocks {...props} />
            ) : (
                <Content content={props.content} />
            )
        }
        </>
    )
}