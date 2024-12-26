export const PRIVILEGED_ACCOUNT_USING_NEWS = "VTSSadmintai";

export const isMobileDevice = () => {
  if (window.outerWidth < 768) {
    return true;
  }
  return false;
};
