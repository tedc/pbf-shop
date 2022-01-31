import { useState, useEffect } from 'react';
import { isEmpty, isNull } from 'lodash';



export default function Timer(props) {
    const { timer, blockId } = props;

    const calculateTimeLeft = () => {
        let difference = +new Date(timer) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;

    }


    const [timeLeft, setTimeLeft] = useState({});

    useEffect(()=> {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return ()=> {
            clearTimeout( timer );
        }
    });


    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval, index) => {
        if (!timeLeft[interval]) {
            return;
        }
        const value = timeLeft[interval];
        let label = '';
        if( interval === 'days') {
            label = value > 0 ? 'giorni' : 'giorno';
        } else if( interval === 'hours') {
            label = value > 0 ? 'ore' : 'ora';
        } else if( interval === 'minutes') {
            label = value > 0 ? 'minuti' : 'minuto';
        } else if( interval === 'seconds') {
            label = value > 0 ? 'secondi' : 'secondo';
        }

        timerComponents.push(
            <div className="countdown__value" key={`time-${blockId}-${index}`}>
                { value }
                <small>{label}</small>
            </div>
        );
    });

    return (
        <div className="countdown">
            {timerComponents.length ? timerComponents : <div className="countdown__value">Offerta scaduta!</div>}
        </div> 
    )

}