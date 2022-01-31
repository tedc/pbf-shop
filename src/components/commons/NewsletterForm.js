import {ArrowRight} from '../icons';

import { useRef } from 'react';
export default function NewsletterForm() {
    const formRef = useRef();
    return (
        <form className="form form--newsletter" noValidate onSubmit={(event)=> subscribe(event)} ref={formRef}>
            <h5 className="title">
                Iscriviti alla newsletter
            </h5>
            <input type="email" name="email" placeholder="La tua email" />
            <button><ArrowRight /></button>
        </form>
    )
}