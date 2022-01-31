import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {useEffect, useRef} from 'react';
import Title from '../commons/Title';

export default function Scroller({scroller, blockId}) {
    const boxRef = useRef();
    const q = gsap.utils.selector(boxRef);
    useEffect(()=> {
        const animation = gsap.timeline({
                //paused : true,
                defaults: {
                    duration: 60,
                    ease: 'none',
                },
                repeat: -1
            }),
            clamp = gsap.utils.clamp(-4, 4);
        let proxy = { time: 1};
        animation
            .to(q('.scroller__container'), {
                x : '-50%',
            }, 0)
        const create = ScrollTrigger.create({
            start: 2,
            once: true,
            onEnter : ()=> {
                const container = q('.scroller__container')[0];
                const column = q('.scroller__column')[0];
                const title = q('.title')[0];
                for(let i = 0; i<12; i++) {
                    const clone = title.cloneNode(true);
                    column.appendChild(clone);
                }
                container.appendChild(column.cloneNode(true));
            }
        });

        const trigger = ScrollTrigger.create({
            trigger: boxRef.current,
            // onEnter: ()=> {
            //     animation.play();
            // },
            // onLeave: ()=> {
            //     animation.pause();
            // },
            onUpdate: ({getVelocity})=> {
                let time = clamp(getVelocity() / -200);
                time = Math.abs(time);
                if (time > proxy.time) {
                    proxy.time = time;
                    gsap.to(proxy, {time: 1, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => 
                animation.timeScale(proxy.time)}, onComplete => {animation.timeScale(1)});
                }
            }
        });
        return ()=> {
            create.kill();
            trigger.kill(); 
        }
    }, [ blockId]);
    const title = {
        size: 'title--font-size-18', 
        content: scroller.text, 
        type: 'h4' 
    }
    return (
        <div className="scroller" ref={boxRef}>
            <div className="scroller__container">
                <div className="scroller__column">
                    <Title title={ title } />
                </div>
            </div>
        </div>
    )
} 