import { useState } from "react";

const ModalDirectLinkHooks = () => {
  const [urlForModalDirectLink, setUrlForModalDirectLink] = useState(null);

  return {
      urlForModalDirectLink,
      setUrlForModalDirectLink,
  }
}

export default ModalDirectLinkHooks