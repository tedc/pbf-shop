import { find, isEmpty, isNull } from 'lodash';
import { TableStyles, displayName, date } from '../../utils/user';
import Link from 'next/link';
import { Dropzone } from '@dropzone-ui/react';
import { useState } from 'react';
import cx from 'classnames';
import Pricelist from './Pricelist';
import PricelistInfo from './PricelistInfo';
import axios from 'axios';

const OrdersTable = ({orders})=> {
    return (
        <table className="table table--private">
            <thead>
                <tr>
                    <th>
                        Ordine
                    </th>
                    <th>
                        Elementi
                    </th>
                    <th>
                        Totale
                    </th>
                    <th>
                        Data
                    </th>
                </tr>
            </thead>
            <tbody>
        {
            orders.map( (order, index) => (
                <tr key={`${order?.orderNumber}-${index}`}>
                    <td>
                        <Link href={{
                            pathname: '/area-clienti/ordine/[id]',
                            query : {
                                id: order?.orderNumber
                            }
                        }}>
                            <a>#{ order?.orderNumber }</a>
                        </Link>
                    </td>
                    <td>
                        { order?.lineItems?.edges.length }
                    </td>
                    <td>
                        { order?.total }
                    </td>
                    <td>
                        { date( order?.date ) }
                    </td>
                </tr>
            ))
        }
            </tbody>
        <style jsx>{
            TableStyles
        }</style>
        </table>
    )
}

export default function Customer(props) {
    const { params, group, } = props;
    const { billingCountries } = props?.countries || {};
    const customer = find(group, (c)=> c?.databaseId === parseInt( params?.id) );
    const [ isProcessing, setIsProcessing ] = useState( false );
    const [ files, setFiles ] = useState( [] );
    const [ pricelist, setPricelist ] = useState( null );
    const [ errorMessage, setErrorMessage ] = useState(null); 
    const [ isInfoOpen, setIsInfoOpen ] = useState(false);
    const [ isSuccess, setIsSuccess ] = useState(false);

    const handleFileInput = (files) => {
        setIsProcessing(true)
        setFiles(files)
    }

    const clearFiles = ()=> {
        setFiles([]);
        setPricelist(null);
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing( true );
        const fields = {
            pricelist: pricelist,
            user_id: params?.id
        }

        const { data } = await axios.post('/api/user/update-pricelist', fields);
        const session = await axios.get('/api/auth/session?update');
        setIsProcessing( false );
        const {
            success,
            data : result,
            error
        } = data;
        setIsSuccess( success );
        if( ! success ) {
            setErrorMessage( data?.error?.message )
        }
    }

    const country = (c)=> {
        return find(billingCountries, (co) => co?.value === c);
    }
    return (
        <>
        <h2 className="title title--grow-40-bottom title--font-size-24">{ displayName(customer) }</h2>
        <header className="header header--customer-address columns columns--jcsb">
            { customer?.billing?.address1 && <span dangerouslySetInnerHTML={ { __html : customer?.billing?.address1} }></span>}
            { customer?.billing?.postcode && <span dangerouslySetInnerHTML={ { __html : customer?.billing?.postcode} }></span>}
            { customer?.billing?.city && <span dangerouslySetInnerHTML={ { __html : customer?.billing?.city} }></span>}
            { customer?.billing?.country && <span dangerouslySetInnerHTML={ { __html : country(customer?.billing?.country).label } }></span>}
            { customer?.billing?.vat && <span dangerouslySetInnerHTML={ { __html : `P.iva ${customer?.billing?.vat}`} }></span>}
        </header>
        <form className={cx('form form--main', {'form--loading':isProcessing})} noValidate onSubmit={(event) => handleFormSubmit(event)}>
            <div className="columns columns--gutters">
                <div className="column column--input column--relative column--grow-30-bottom">
                    <label className="upload" htmlFor="pricelist">
                        <span className="upload__content">
                            Aggiorna il listino prezzi
                            { !isEmpty(files) && <span style={{fontSize:11}}><br/>{files[0].file?.name}</span>}
                        </span>
                        <i className="upload__info" onClick={()=> setIsInfoOpen(true)}>?</i>
                        <i className="upload__btn"></i>
                        {  !isEmpty(files) && <i className="upload__clear" onClick={()=> clearFiles()}></i> }
                        <Dropzone
                            header={true}
                            footer={false}
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                opacity: 0,
                            }}
                            minHeight="100%"
                            maxHeight="100%"
                            maxFiles={1}
                            localization='IT-it'
                            url="/api/user/upload"
                            value={files}
                            onUploadStart={handleFileInput}
                            uploadOnDrop={true}
                            onUploadFinish={(res)=> {
                                if( res[0].serverResponse?.status ) {
                                    setPricelist( res[0].serverResponse?.sheet );
                                    setIsProcessing(false);
                                }
                            }}
                            behaviour="replace"
                      ></Dropzone>
                    </label>
                </div>
                { !isNull(pricelist) && <div className="column column--aligncenter">
                    <button className="button button--rounded button--bg-black">Aggiorna</button>
                </div> }
            </div>
            { isSuccess && !isNull(pricelist) && <div style={{padding: '15px', color: 'white', margin: '20px 0', background: '#68b702', fontWeight: 'bold', textAlign: 'center'}}>Pricelist caricata correttamente</div> }
            { !isNull(errorMessage) && <div>{errorMessage}</div>}
        </form>
        <div className="columns columns--gutters">
            <div className="column column--grow-40 column--s6-xs column--s3-md column--data">
                <div className="data">
                    Numero ordini<br/>
                    <strong>
                        { !isEmpty( customer?.orders?.nodes ) ? customer?.orders?.nodes?.length : 0 }
                    </strong>
                </div>
            </div>
            <div className="column column--grow-40 column--s6-xs column--s3-md column--data">
                <div className="data">
                Totale ordini<br/>
                <strong>
                    { customer?.totalSpent  ? `€${customer?.totalSpent}` : '/' }
                </strong>
                </div>
            </div>
            <div className="column column--grow-40 column--s6-xs column--s3-md column--data">
                <div className="data"> 
                Valore medio<br/>
                <strong>
                    { customer?.averageSpent  }
                </strong>
                </div>
            </div>
            <div className="column column--grow-40 column--s6-xs column--s3-md column--data">
                <div className="data">
                Frequenza ordini<br/>
                <strong>
                    { customer?.purchaseMonthlyFrequency  }
                </strong>
                </div>
            </div>
        </div>
        {
            !isEmpty( customer?.orders?.nodes ) && <OrdersTable orders={customer?.orders?.nodes} />
        }
        <style jsx>{
            `.header--customer-address {
                background-color: black;
                color: white;
                padding: 20px;
            }
            .header--customer-address p {
                flex: 0 0 auto;
                font-size: 12px;
                padding: 15px;
            }
            @media screen and (min-width:40em) {
                .header--customer-address p {
                    padding: 20px;
                }
            }
            .column--data .data {
                padding: 20px;
                text-align: center;
                background-color: white;
                border-radius: 5px;
                font-size: 14px;
            }
            .column--data .data strong {
                display: inline-block;
                margin-top: 20px;
                font-size: 24px;
            }
            .form--main {
                padding-top: 40px;
            }
            `
        }</style>
        <PricelistInfo {...{isInfoOpen, setIsInfoOpen}} />
        </>
    )
}