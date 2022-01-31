import { gql } from '@apollo/client';

export const GET_TUTORIAL = gql`
query GET_TUTORIAL($id: ID!) {
    tutorial(id: $id, idType: DATABASE_ID) {
        seminarInfo {
            seminarCapacity
            seminarDate
            seminarDuration
            seminarMaterials
            seminarPlace
            seminarTeachers
            webinarCapacity
            webinarDate
            webinarDuration
            webinarMaterials
            webinarPlace
            webinarTeachers
        }
        content
        tutorialId
        title
        featuredImage {
            node {
                sourceUrl
            }
        }
    }
}`;

export const GET_TUTORIALS = gql`
query GET_TUTORIALS($where: RootQueryToTutorialConnectionWhereArgs) {
    tutorials(where: $where) {
        nodes {
            tutorialId
            title
            seminarInfo {
                seminarDate
                webinarDate
            }
            featuredImage {
                node {
                    sourceUrl
                }
            }
        }
        pageInfo {
            offsetPagination {
                total
            }
        }
    }
}`;