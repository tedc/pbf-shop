import { gql } from "@apollo/client";

export const APPLY_COUPON = gql`
mutation APPLY_COUPON( $input: ApplyCouponInput! ) {
  applyCoupon(input: $input) {
    applied {
      code
      discountAmount
    }
  }
}
`;


export const REMOVE_COUPONS = gql`
mutation REMOVE_COUPONS( $input: RemoveCouponsInput! ) {
    removeCoupons( input: $input ) {
        cart {
          discountTotal
        }
    }
}
`;