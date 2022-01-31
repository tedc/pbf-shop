import { sanitizeContent } from '../utils/pages';
export default function Content({content}) {
    const contentText = sanitizeContent(content);
    return (
        <div className="columns columns--jcc columns--shrink columns--grow-140">
            <div className="content content--page column column--s7-lg" dangerouslySetInnerHTML={{ __html: contentText }}>
            </div>
        </div>
    )
}