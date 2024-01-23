import { useEffect } from "react";

import {
  useNotification,
  useFetchClient,
  useAPIErrorHandler,
} from "@strapi/helper-plugin";
import { useQueries } from "react-query";

import { cleanPermissions, getTrad } from "../../../utils";
import pluginId from "../../../pluginId";

export const usePlugins = () => {
  const toggleNotification = useNotification();
  const { get } = useFetchClient();
  const { formatAPIError } = useAPIErrorHandler(getTrad);

  const [
    {
      data: permissions,
      isLoading: isLoadingPermissions,
      error: permissionsError,
      refetch: refetchPermissions,
    },
    {
      data: routes,
      isLoading: isLoadingRoutes,
      error: routesError,
      refetch: refetchRoutes,
    },
  ] = useQueries([
    {
      queryKey: [pluginId, "permissions"],
      async queryFn() {
        const {
          data: { permissions },
        } = await get(`/${pluginId}/permissions`);

        return permissions;
      },
    },
    {
      queryKey: [pluginId, "routes"],
      async queryFn() {
        const {
          data: { routes },
        } = await get(`/${pluginId}/routes`);

        return routes;
      },
    },
  ]);

  const refetchQueries = async () => {
    await Promise.all([refetchPermissions(), refetchRoutes()]);
  };

  useEffect(() => {
    if (permissionsError) {
      toggleNotification({
        type: "warning",
        message: formatAPIError(permissionsError),
      });
    }
  }, [toggleNotification, permissionsError, formatAPIError]);

  useEffect(() => {
    if (routesError) {
      toggleNotification({
        type: "warning",
        message: formatAPIError(routesError),
      });
    }
  }, [toggleNotification, routesError, formatAPIError]);

  const isLoading = isLoadingPermissions || isLoadingRoutes;

  return {
    // TODO: these return values need to be memoized, otherwise
    // they will create infinite rendering loops when used as
    // effect dependencies
    permissions: permissions ? cleanPermissions(permissions) : {},
    routes: routes ?? {},

    getData: refetchQueries,
    isLoading,
  };
};
