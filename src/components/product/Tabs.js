import {gsap} from 'gsap/dist/gsap';
import {isEmpty, isNull, isUndefined} from 'lodash';
import {useRef, useEffect, useState} from 'react';
import cx from 'classnames';
export default function Tabs(props) {
    const { tabs } = props;
    if( isNull(tabs.firstTab.content) || isNull(tabs.firstTab.title) || isNull(tabs.secondTab.title) || isNull(tabs.secondTab.content) )  {
        return null;
    }
    const tabsRef = useRef();
    let i;
    if(!isNull(tabs.firstTab.content) && !isNull(tabs.firstTab.content)) {
        i = 1;
    } else {
        if(!isNull(tabs.secondTab.content) && !isNull(tabs.secondTab.content) ) {
            i = 2;
        } else {
            if(!isNull(tabs.thirdTab.content) && !isNull(tabs.thirdTab.content) && !isEmpty(tabs.thirdTab.title) && !isNull(tabs.thirdTab.title)) {
                i = 3;
            }
        }
    }
    const [tab, setTab] = useState(i);
    const [init, setInit] = useState(false);
    const setTabs = (event, t)=> {
        event.preventDefault();
        setInit(true);
        setTab(t);
    }
    useEffect(()=> {
        if(process.browser &&  init) {
            const div = tabsRef.current;
            const currentTab = div.querySelector(`[data-tab="${tab}"]`);
            const activeTab = div.querySelector('.tab--active');
            const timeline = gsap.timeline({
                defaults: {
                    overwrite: 'auto',
                    duration: .5,
                }
            });
            timeline
                .to(activeTab, {
                    autoAlpha: 0,
                    onComplete: ()=> {
                        activeTab.classList.remove('tab--active')
                        currentTab.classList.add('tab--active')
                    }
                })
            if(!currentTab.classList.contains('tab--active')) {
            timeline.fromTo(currentTab, {
                    autoAlpha: 0,
                },{
                    autoAlpha: 1,
                })
            }
                
        }
        
    });
    return (
        <div className="tabs tabs--grow-40-top" ref={tabsRef}>
            <nav className="tabs__nav">
            { (!isNull(tabs.firstTab.content) && !isNull(tabs.firstTab.content) ) && <a href="#" onClick={(event)=> setTabs(event, 1)} className={cx('tabs__link',{'tabs__link--active': tab === 1})}>{ !isEmpty(tabs.firstTab.title) && !isNull(tabs.firstTab.title) ? tabs.firstTab.title : 'Uso' }</a> }
            { (!isNull(tabs.secondTab.content) && !isNull(tabs.secondTab.content) ) && <a href="#" onClick={(event)=> setTabs(event, 2)} className={cx('tabs__link',{'tabs__link--active': tab === 2})}>{ !isEmpty(tabs.secondTab.title) && !isNull(tabs.secondTab.title) ? tabs.secondTab.title : 'Effetto' }</a> }
            { (!isNull(tabs.thirdTab.content) && !isNull(tabs.thirdTab.content) && !isEmpty(tabs.thirdTab.title) && !isNull(tabs.thirdTab.title)) && <a href="#" onClick={(event)=> setTabs(event, 2)} className={cx('tabs__link',{'tabs__link--active': tab === 3})}>{ tabs.thirdTab.title }</a> }
            </nav>
            { (!isNull(tabs.firstTab.content) && !isNull(tabs.firstTab.content) ) && <div  data-tab="1" dangerouslySetInnerHTML={{__html : tabs.firstTab.content}} className={cx('tab',{'tab--active': i === 1})}></div> }
            { (!isNull(tabs.secondTab.content) && !isNull(tabs.secondTab.content) ) && <div data-tab="2" dangerouslySetInnerHTML={{__html : tabs.secondTab.content}} className={cx('tab',{'tab--active': i === 2})}></div> }
            { (!isNull(tabs.thirdTab.content) && !isNull(tabs.thirdTab.content) && !isEmpty(tabs.thirdTab.title) && !isNull(tabs.thirdTab.title) ) && <div data-tab="3" dangerouslySetInnerHTML={{__html : tabs.thirdTab.content}} className={cx('tab',{'tab--active': i === 3})}></div> }
        </div>
    )
}