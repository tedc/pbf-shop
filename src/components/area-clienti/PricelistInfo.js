import { CSSTransition } from 'react-transition-group';
import Pricelist from './Pricelist';

export default function PriclistLinfo({isInfoOpen, setIsInfoOpen}) {
    const pricelist = [
        {
            'sku': '0920928',
            'nome' : 'Nome prodotto lorem',
            'email' : 'indirizzo@sito.com',
            'prezzo' : 4,
            'qta' : 3
        },
        {
            'sku': '0920923',
            'nome' : 'Nome prodotto ipsum',
            'email' : 'indirizzo@sito.it',
            'prezzo' : 2,
            'qta' : 2
        },
        {
            'sku': '0920973',
            'nome' : 'Nome prodotto spem',
            'email' : 'indirizzo@sito.net',
            'prezzo' : 2,
            'qta' : 2
        },
        {
            'sku': '0920928',
            'nome' : 'Nome prodotto lorem',
            'email' : 'indirizzo@sito.com',
            'prezzo' : 4,
            'qta' : 3
        },
        {
            'sku': '0920923',
            'nome' : 'Nome prodotto ipsum',
            'email' : 'indirizzo@sito.it',
            'prezzo' : 2,
            'qta' : 2
        },
        {
            'sku': '0920973',
            'nome' : 'Nome prodotto spem',
            'email' : 'indirizzo@sito.net',
            'prezzo' : 2,
            'qta' : 2
        },{
            'sku': '0920928',
            'nome' : 'Nome prodotto lorem',
            'email' : 'indirizzo@sito.com',
            'prezzo' : 4,
            'qta' : 3
        },
        {
            'sku': '0920923',
            'nome' : 'Nome prodotto ipsum',
            'email' : 'indirizzo@sito.it',
            'prezzo' : 2,
            'qta' : 2
        },
        {
            'sku': '0920973',
            'nome' : 'Nome prodotto spem',
            'email' : 'indirizzo@sito.net',
            'prezzo' : 2,
            'qta' : 2
        }
    ]
    return (
        <>
        <CSSTransition classNames="fade-in" in={isInfoOpen} unmountOnExit timeout={750}>
        <div className="modal">
            <i className="modal__close" onClick={()=> setIsInfoOpen(false)}></i>
            <div className="modal__content">
                <p>Per caricare o aggiornare la pricelist del parrucchiere devi caricare un file exel in questo formato</p>
                <Pricelist pricelist={pricelist} isModal={true} />
            </div>
        </div>
        </CSSTransition>
        <style jsx>{
            `
            .modal  {
                position: fixed;
                z-index: 99999999;
                background-color: rgba(0,0,0,.4);
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow-x: hidden;
                overflow-y: auto;
                padding: 15px;
            }
            .modal__close {
                position: fixed;
                right: 30px;
                top: 15px;
                width: 30px;
                height: 30px;
                border-radius: 30px;
                background-color: black;
                transition: opacity .5s;
                z-index: 99999999;
                cursor: pointer;
            }
            .modal__close:hover {
                opacity: .7;
            }
            .modal__close:before, .modal__close:after {
                position: absolute;
                width: 10px;
                height: 2px;
                background: white;
                content: '';
                left: 50%;
                top: 50%;
                margin: -1px 0 0 -5px;
            }
            .modal__close:after {
                transform: rotate(-45deg) translateZ(0);
            }
            .modal__close:before {
                transform: rotate(45deg) translateZ(0);
            }
            .modal__content {
                max-width: 720px;
                background-color: white;
                padding: 15px;
                margin: auto;
            }
            .modal__content p {
                font-size: 14px;
                margin-bottom: -30px;
            }
            @media screen and (min-width:40em) {
                .modal__content {
                    padding: 40px;
                }
            }
            .fade-in-enter {
                opacity: 0;
                visibility: hidden;
            }
            .fade-in-enter-active {
                opacity: 1;
                visibility: visible;
                transition: opacity .75s;
            }
            .fade-in-enter-done {
                visibility: visible;
                opacity: 1;
            }
            .fade-in-exit {
                visibility: visible;
                opacity: 1;
            }
            .fade-in-exit-active {
                visibility: visible;
                opacity: 0;
                transition: opacity .75s;
            }
            .fade-in-exit-done {
                visibility: hidden;
                opacity: 0;
            }`}</style>
        </>
    )
}