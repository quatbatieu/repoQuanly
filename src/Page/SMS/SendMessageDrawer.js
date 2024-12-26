import React, { useEffect, useState } from 'react';
import SelectTemplate from './SelectTemplate';
import ImportListDrawer from './ImportListDrawer';
import addKeyLocalStorage from 'helper/localStorage';

const SendMessageDrawer = ({ isSendMessageDrawer, setIsSendMessageDrawer , fetchMessage }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [template, setTemplate] = useState(null);
  const handleTemplateClick = (template) => {
    sessionStorage.setItem(addKeyLocalStorage("saveSmsTemplate") , JSON.stringify(template))
    setTemplate(template);
    setCurrentStep(2);
  };

  useEffect(() => {
    const saveSmsTemplate = sessionStorage.getItem(addKeyLocalStorage("saveSmsTemplate"))
    if(saveSmsTemplate){
      setTemplate(JSON.parse(saveSmsTemplate));
      setCurrentStep(2);
    }
  }, []);

  return (
    <div>
      {currentStep === 1 && <SelectTemplate onTemplateClick={handleTemplateClick} isSendMessageDrawer={isSendMessageDrawer} setIsSendMessageDrawer={setIsSendMessageDrawer} />}
      {currentStep === 2 && <ImportListDrawer isSendMessageDrawer={isSendMessageDrawer} setIsSendMessageDrawer={setIsSendMessageDrawer} template={template} fetchMessage={fetchMessage} setTemplate={setTemplate} setCurrentStep={setCurrentStep} />}
    </div>
  );
};

export default SendMessageDrawer;
