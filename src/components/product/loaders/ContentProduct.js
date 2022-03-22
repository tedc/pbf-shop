import ContentLoader from 'react-content-loader'
const ContentProductLoader = ()=> (
    <div className="columns columns--archive"> 
    { 
        Array.from({length: 4}).map((item, index)=> (
            <div className="column column--s6-sm column--s4-md column--s3-lg" key={`content-loader-${index}`}>
                <div className="product product--item product--item-loader">
                    <ContentLoader viewBox="0 0 310 330"  foregroundColor="#ccc" backgroundColor="#bbb" style={{position: 'absolute', left: 20, top: 20, right: 20, bottom: 20 }}>
                        <rect x="0" y="0" width="310" height="260" />
                        <rect x="0" y="275" rx="5" ry="5" width="50" height="20" />
                        <rect x="0" y="305" rx="5" ry="5" width="150" height="20" />
                        <rect x="280" y="305" rx="5" ry="5" width="30" height="20" />
                    </ContentLoader>
                </div>
            </div>
        )) 
    }
    <style jsx>{
        `
        .product--item-loader {
            position: relative;
            width: 100%;
            flex: 0 0 auto;
            display: flex;
        }
        .product--item-loader:before {
            width: 100%;
            content: '';
            padding-top: ${(330/310) * 100}%;
        }
        `
    }</style>
    </div>
)

export default ContentProductLoader;