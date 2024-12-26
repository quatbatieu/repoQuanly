import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const useAddPermissionToUrl = (permissions=[]) => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (permissions && permissions.length > 0) {
      const existingPermissions = searchParams.getAll('permission');

      permissions.forEach(permission => {
        if (!existingPermissions.includes(permission)) {
          searchParams.append('permission', permission);
        }
      });

      history.replace({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
    }
  }, [permissions, location.search, history]);
};

export default useAddPermissionToUrl;
