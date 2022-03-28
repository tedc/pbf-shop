import { GET_CUSTOMER_GROUP } from '../src/queries/users/get-user';
import client from "../src/components/ApolloClient";
export default async function getCustomerArea(session) {
    const { data } = await client.query( {
        query : GET_CUSTOMER_GROUP,
        variables: {
            parent : session?.user?.databaseId
        },
        context: {
            headers: {
                'authorization' : session?.accessToken ? `Bearer ${session?.accessToken}`: '',
            }
        }
    });
    return data;
}