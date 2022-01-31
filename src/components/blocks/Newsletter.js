import Image from '../../image';
import cx from 'classnames';
import NewsletterForm from '../commons/NewsletterForm';
export default function Newsletter(props) {
    const { content, picture } = props;
    const columnsClassName = cx('columns', 'columns--shrink', 'columns--grow-100', 'columns--relative', 'columns--color-white');
    const colClassName = cx('column', 'column--content-newsletter', 'column--relative', 'column--s5-lg', 'column--s3-xl');
    const rowClassName = cx('row');
    return (
        <div className={rowClassName}>
            <div className={columnsClassName}>
                {   
                    picture && (
                        <Image
                            width={picture?.mediaDetails?.width}
                            height={picture?.mediaDetails?.height}
                            loading="lazy"
                            sourceUrl={ picture?.sourceUrl ?? '' }
                            altText={picture?.altText ?? title}
                            layout="fill"
                        />
                    )         
                }      
                
                <div className={colClassName}>
                    <div className="content content--newsletter-cover" dangerouslySetInnerHTML={{ __html: content }}></div>
                    <NewsletterForm />
                </div>
            </div>
        </div>
    )
}