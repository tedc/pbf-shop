const UserFragment = `
    totalSpent
    orderCount
    displayName
    firstName
    lastName
    id
    databaseId
    username
    purchaseMonthlyFrequency
    averageSpent
    billing {
        address1
        address2
        city
        company
        country
        email
        firstName
        lastName
        phone
        postcode
        state
        vat
    }
    shipping {
        address1
        address2
        city
        company
        country
        email
        firstName
        lastName
        phone
        postcode
        state
    }
`;

export default UserFragment;