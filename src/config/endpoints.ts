import COMMON_CONSTANTS from "@/constants/commanConstants";

const ENDPOINTS = {
    LOGIN: `${COMMON_CONSTANTS.API_BASE_URL}/auth/login`,
    REFRESH_TOKEN: `${COMMON_CONSTANTS.API_BASE_URL}/auth/refresh-token`,
    CALLS: `${COMMON_CONSTANTS.API_BASE_URL}/calls`,

}

export default ENDPOINTS;