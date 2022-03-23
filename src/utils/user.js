import client from "../components/ApolloClient";
import { UPDATE_USER, REGISTER_USER, RESET_PASSWORD } from '../mutations/update-user';
import { v4 } from 'uuid';
import { isEmpty } from 'lodash';
import axios from 'axios';


export async function UpdateUser(input, token, update = true) {
    const { data, errors } = await client.mutate( {
        mutation: update ? UPDATE_USER : REGISTER_USER,
        variables: {
            input: {
                ...input,
                clientMutationId: v4(),
            },
        },
        context: {
            headers: {
                'authorization' : token ? `Bearer ${token}`: '',
            }
        }
    } );

    return {data, errors} || {};
}

export async function ResetPassword(input) {
    const { data, errors } = await client.mutate( {
        mutation: RESET_PASSWORD,
        variables: {
            input: {
                ...input,
                clientMutationId: v4(),
            },
        },
    } );

    return {data, errors} || {};
}

export const createUserInputData = (input, isShipping)=> {
    const fields = isShipping ? input.shipping : input.billing;
    const keys = [
        'lastName',
        'firstName',
        'country',
        'state',
        'address1',
        'address2',
        'postcode',
        'city',
        'phone'
    ];
    if( !isShipping ) {
        keys.push('email');
        keys.push('vat');
        keys.push('company');
    }

    const data = {};

    keys.map((key) => {
        data[key] = fields[key];
    })
    return data;
}

export const TableStyles = `
.table--private th {
    font-weight: normal;
    text-align: left;
    font-size: 12px;
    padding-bottom: 20px;
    border-bottom: 1px solid black;
}
.table--private td {
    border-bottom: 1px solid black;
    padding: 20px 20px 20px 0;
}
.table--private tr td:nth-child(1) {
    padding-left: 20px;
}
.table--private td a:not(.button) {
    font-weight: bold;
    font-size: 15px;
}
@media screen and (max-width:39.99em) {
    .table--private thead {
        display: none;
    }
    .table--private tr {
        display: block;
        border-bottom: 1px solid black;
        padding: 10px 0;
    }
    .table--private tbody tr:nth-child(1) {
        border-top: 1px solid black;
    }

    .table--private td[data-title] {
        border: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0!important;
    }
    .table--private td[data-title]:before {
        content: attr(data-title);
    }
}
`;

export const displayName = (client)=> {
    if( !isEmpty( client?.displayName?.trim() ) ) {
        return client?.displayName;
    } else if( !isEmpty( client?.firstNam?.trim() ) || !isEmpty( client?.lastName?.trim() ) ) {
        const array = [];
        if( client?.firstName ) array.push(client?.firstName);
        if( client?.lastName ) array.push(client?.lastName);
        return array.join(' ');
    } else {
        return client?.username
    }
}

export const date = (d)=> {
    const time =  new Date( d );
    return time.toLocaleDateString('it-IT', {
        year: 'numeric', month: 'numeric', day: 'numeric'
    });
}

export const getRole = (session)=> {
    const roles = session?.user?.roles?.nodes;
    const array = []
    if( !isEmpty( roles) ) {
        roles.map((node)=> {
            array.push(node?.name);
        });
    }
    if( array.indexOf('wholesaler') !== -1 ) {
        return 'wholesaler';
    } else if( array.indexOf('hairdresser') !== -1 ) {
        return 'hairdresser';
    } else {
        return 'customer';
    }
}

export const pricelistLayouts = [
    {key: 'sku', label: 'Codice prodotto'}, {key: 'nome', label: 'Nome prodotto'}, {key : 'email', label: 'Email parrucchiere'}, {key: 'prezzo', label : 'Prezzo'}, {key: 'qta', label : 'Quantità'}
];

export const getWholesalerOrders = (session)=> axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/pbf/v1/wholesaler-orders`, {
    headers: {
        Authorization: `Bearer ${session?.accessToken}`
    }
});