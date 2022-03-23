import {TableStyles, displayName, date } from '../../utils/user';
import Link from 'next/link';
import { isEmpty } from 'lodash';
export default function GroupTable(props) {
    const { group } = props;
    const columns = [
        {
            id: 'name',
            label : 'Nome'
        },
        {
            id: 'total',
            label : 'Totale'
        },
        {
            id: 'value',
            label : 'Valore'
        },
        {
            id: 'last-order',
            label : 'Ultimo ordine'
        },
        {
            id: 'link',
            label : 'Scheda'
        }
    ];
    const Td = ({id, client})=> {
        if( id === 'name') {
            return <Link href={{
                pathname: '/area-clienti/rete/cliente/[id]',
                query: {
                    id : client?.databaseId
                }
            }}><a dangerouslySetInnerHTML={{__html: displayName(client) }}></a></Link>;
        } else if( id === 'total' ) {
            return client.orderCount ? client.orderCount : <>Nessun ordine<br/>effettuato</>;
        } else if( id === 'value' ) {
            return client.totalSpent ? `€${client.totalSpent}` : '/';
        } else if( id === 'last-order' ) {
            return !isEmpty( client?.orders?.nodes ) ? date( client?.orders?.nodes[0]?.date ) : '/';
        } else {
            return <Link href={{
                pathname: '/area-clienti/rete/cliente/[id]',
                query: {
                    id : client?.databaseId
                }
            }}><a className="button button--rounded button--bg-black">Vedi</a></Link>
        }                          
    }
        
    return (
        <>
        <h2 className="title title--grow-40-bottom title--font-size-24">Rete</h2>
        <table className="table table--private">
            <thead>
                <tr>
                    { columns.map( (th, index)=> (
                    <th key={`${th.id}-${index}`}>
                        { th.label }
                    </th>
                    ) )}
                </tr>
            </thead>
            <tbody>
                {
                    group.map( (client, index) => (
                        <tr key={`${client.databaseId}-${index}`}>
                            { columns.map( (th, index)=> {
                                return (
                                <td key={`${th.id}-${index}`} data-title={ th.label }>
                                    <Td id={th.id} client={client} />
                                </td>
                                )
                            } )}
                        </tr>
                    ))
                }
            </tbody>
            <style jsx>{
                TableStyles
            }</style>
        </table>
        </>
    )
}