export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;

export const API = {
  REGISTER_ADMIN: `${BASE_URL}/admin/register-admin`,
  LOGIN_ADMIN: `${BASE_URL}/admin/login-admin`,
  GET_PROFILE_DATA: `${BASE_URL}/admin/profile`,

  GET_REGISTERED_RIDERS: `${BASE_URL}/admin/get-registered-riders`,
  GET_RIDER_DATA: `${BASE_URL}/admin/get-rider-data`,
  EDIT_RIDER_DEPOSIT: `${BASE_URL}/admin/edit-rider-deposit`,
  TOGGLE_BLOCK_RIDER: `${BASE_URL}/admin/toggle-block-rider`,
  GET_UNSETTLED_ORDERS: `${BASE_URL}/admin/get-unsettled-orders`,
  MARK_SETTLED_ORDERS: `${BASE_URL}/admin/mark-settled-orders`,

  GET_REGISTERED_RESTAURANTS: `${BASE_URL}/admin/get-registered-restaurants`,
  GET_RESTAURANT_DATA: `${BASE_URL}/admin/get-restaurant-data`,
  TOGGLE_BRAND_RESTAURANT: `${BASE_URL}/admin/toggle-restaurant-brand`,
  GET_WEEKLY_ORDERS: `${BASE_URL}/admin/get-weekly-orders`,
  GET_PENDING_PAYOUTS: `${BASE_URL}/admin/get-pending-payouts`,
  GET_PAID_PAYOUTS: `${BASE_URL}/admin/get-paid-payouts`,
  PAY_PENDING_PAYOUT: `${BASE_URL}/admin/pay-pending-payout`,

  GET_LIVE_ORDERS: `${BASE_URL}/admin/get-live-orders`,
  GET_PAST_ORDERS: `${BASE_URL}/admin/get-past-orders`,
  GET_SEARCHED_ORDER: `${BASE_URL}/admin/get-searched-past-order`,

  GET_DASHBOARD_DATA: `${BASE_URL}/admin/get-dashboard-data`,

  SEND_PUSH_NOTIFICATION: `${BASE_URL}/admin/send-push-notification`
};
