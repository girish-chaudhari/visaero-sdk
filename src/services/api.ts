export const getEnterpriseAccountHostDetails =
  "/enterprise-admin/getEnterpriseAccountsHostDetails";

export const getNewsAndUpdates = "/visa-admin/getNewsAndUpdates";
export const getNotification = "/visa-admin/getAppNotifications";
export const getNewDashboard = "/visa-admin/getNewDashboardData";

export const verifyAdminUserSession = "/user-admin/verifyAdminUserSession";
export const login = "/user-admin/login";
export const forgotPassword = "/user-admin/generateOtpForResetPassword";

export const ipApi = "https://ipapi.co/json/";

export const getNationalities = "/brule-engine/getNationalities";
export const getOrigin = "/brule-engine/getOriginCountries";
export const getTravellingto = "/brule-engine/getTravellingTo";
export const getSupportedCurrencies = "/visa-admin/getSupportedCurrencies";
export const getVisaOffers = "/visa/getVisaOffers";
export const getVisaDocuments = "/visa/getVisaDocuments";
export const saveVisaForm = "/visa/getVisaOffers";
export const uploadAndExtractDocuments =
  "/process-documents/uploadAndExtractDocument";
export const createApplicationWithDocuments =
  "/visa/createApplicationWithDocuments";
export const getAnonymouseUser = "/qr-visa/registerAnonymousUser";

const API = {
  getEnterpriseAccountHostDetails,
  getNewsAndUpdates,
  getNotification,
  getNewDashboard,
  verifyAdminUserSession,
  login,
  forgotPassword,
  ipApi,
  getNationalities,
  getOrigin,
  getTravellingto,
  getSupportedCurrencies,
  getVisaOffers,
  saveVisaForm,
  uploadAndExtractDocuments,
  createApplicationWithDocuments,
  getVisaDocuments,
  getAnonymouseUser,
};

export default API;
