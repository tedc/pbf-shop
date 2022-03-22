import ContentLoader from 'react-content-loader'
const SingleProductLoader = ()=> (
    <div className="columns columns--block columns--block-product columns--block-product-loader">
        <div className="column--s6-md column--figure column--product-preloader">
            <div>
            <ContentLoader viewBox="0 0 658 618" foregroundColor="#ccc" backgroundColor="#bbb">
                <rect x="0" y="0" width="658" height="618" />
            </ContentLoader>
            </div>
        </div>
        <div className="column column--s6-md column--content column--product-preloader">
            <div>
            <ContentLoader viewBox="0 0 658 618" foregroundColor="#ccc" backgroundColor="#bbb">
                <rect x="0" y="0" rx="5" ry="5" width="200" height="20" />
                <rect x="0" y="50" rx="5" ry="5" width="658" height="20" />
                <rect x="0" y="100" rx="5" ry="5" width="658" height="20" />
                <rect x="0" y="150" rx="5" ry="5" width="658" height="20" />
                <rect x="0" y="200" rx="5" ry="5" width="80" height="20" />
                <rect x="289" y="200" rx="5" ry="5" width="80" height="20" />
                <rect x="578" y="200" rx="5" ry="5" width="80" height="20" />
            </ContentLoader>
            </div>
        </div>
        <style jsx>{
            `
            .column--top {
                height: 53px;
                background: #000;
            }
            
            .column--product-preloader div {
                position: relative;
                width: 100%;
                flex: 0 0 auto;
            }
            .column--product-preloader div:before {
                width: 100%;
                content: '';
                padding-top: ${(618/658) * 100}%;
            }
            .column--product-preloader svg {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            `
        }</style>
    </div>
)
export default SingleProductLoader;