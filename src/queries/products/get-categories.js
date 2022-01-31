import { gql } from '@apollo/client'; 
import CategoriesFragment from '../fragments/categories';


export const GET_CATEGORIES = gql`
 {   
    ${CategoriesFragment}
 }`;