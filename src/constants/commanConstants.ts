const COMMON_CONSTANTS = {
  TICKET_KEY: 'ACCESS_TOKEN',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  PUSHER_SDK_AUTH: process.env.PUSHER_SDK_AUTH || '',
  API_KEY:process.env.API_KEY || '',
  APP_CLUSTER:process.env.APP_CLUSTER || '',
};
export default COMMON_CONSTANTS;
