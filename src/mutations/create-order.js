import { gql } from "@apollo/client";

const CREATE_ORDER = gql`
mutation CREATE_ORDER($input: CreateOrderInput!) {
    createOrder(input: $input) {
        orderId,
        order {
            total
            status
            currency
        }
    } 
}
`

export default CREATE_ORDER;