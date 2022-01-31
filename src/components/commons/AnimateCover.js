import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from '../../image';

export default function AnimateCover({ picture, fromTop}) {
    return (
        <figure className="figure figure--full">
        <Image
            width={picture?.mediaDetails?.width}
            height={picture?.mediaDetails?.height}
            loading="lazy"
            sourceUrl={ picture?.sourceUrl ?? '' }
            altText={picture?.altText ?? title}
            layout="fill"
        />
        </figure>
    )
}