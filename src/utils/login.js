import client from "../components/ApolloClient";
import {LOGIN, REFRESH} from '../mutations/login';
import { GET_CUSTOMER } from '../queries/users/get-user';
import { v4 } from 'uuid';

export async function loginUser( {username, password} ) {
    const { data, errors } = await client.mutate( {
        mutation: LOGIN,
        variables: {
            input: {
                clientMutationId: v4(), // Generate a unique id
                username: username || '',
                password: password || '',
            },
        },
    } );


    return {data, errors } || {};
}


export async function refreshToken( token, id ) {
    const { data, errors } = await client.mutate( {
        mutation: REFRESH,
        variables: {
            input: {
                clientMutationId: v4(), // Generate a unique id
                jwtRefreshToken: token,
            },
        },
    } );

    const { data: customer } = await client.query({
            query: GET_CUSTOMER,
            variables: {
                id: id
            },
            context: {
                headers: {
                    'authorization' : data?.refreshJwtAuthToken?.authToken ? `Bearer ${data?.refreshJwtAuthToken?.authToken}`: '',
                }
            }
        }
    );


    if( data && customer ) {
        return {
            token: data?.refreshJwtAuthToken?.authToken,
            user: {
                id: customer?.customer?.id,
                databaseId: customer?.customer?.databaseId,
                email: customer?.customer?.email,
                firstName: customer?.customer?.firstName,
                lastName: customer?.customer?.lastName,
                parentName: customer?.customer?.wholesalerParentName,
                billing: customer?.customer?.billing,
                shipping: customer?.customer?.shipping
            }
        }
    } else {
        return {}
    }
}