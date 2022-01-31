import client from "../components/ApolloClient";
import { UPDATE_USER, REGISTER_USER } from '../mutations/update-user';
import { v4 } from 'uuid';
import { isEmpty } from 'lodash';


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
`;

export const displayName = (client)=> {
    console.log( client )
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
