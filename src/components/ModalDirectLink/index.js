import React, { createContext, useContext } from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import ModalDirectLinkHooks from "./hooks";

export const ModalDirectLinkContext = createContext({
    urlForModalDirectLink: false,
    setUrlForModalDirectLink: () => { },
});

export const ModalDirectLinkContextProvider = ({ children }) =>{
  const { t: translation } = useTranslation()
  const {  
    urlForModalDirectLink,
    setUrlForModalDirectLink
  } = ModalDirectLinkHooks();

  return (
    <ModalDirectLinkContext.Provider value={{ urlForModalDirectLink , setUrlForModalDirectLink }}>
      {children}
        <Modal
          title={translation('Notification')}
          centered
          open={ urlForModalDirectLink ? true : false }
          onOk={() =>
            {
              window.open(`${typeof urlForModalDirectLink === "string" ? urlForModalDirectLink : "/"}`, '_blank');
             setUrlForModalDirectLink(null)

            }
            }
          onCancel={() => setUrlForModalDirectLink(null)}
          okText={<div target="_blank">{translation('confirm')}</div>}
          cancelText= {translation('cancel')}
        >
          {translation('Do_you_want_to_change_the_page')} ?
        </Modal>
    </ModalDirectLinkContext.Provider>
  );
}

export const useModalDirectLinkContext = () => useContext(ModalDirectLinkContext);