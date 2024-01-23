import { getFetchClient } from "@strapi/helper-plugin";
import pluginId from "../../../../../pluginId";

export const fetchData = async (toggleNotification, notifyStatus) => {
  try {
    const { get } = getFetchClient();
    const { data } = await get(`/${pluginId}/roles`);
    notifyStatus("The roles have loaded successfully");

    return data;
  } catch (err) {
    toggleNotification({
      type: "warning",
      message: { id: "notification.error" },
    });

    throw new Error(err);
  }
};

export const deleteData = async (id, toggleNotification) => {
  try {
    const { del } = getFetchClient();
    await del(`/${pluginId}/roles/${id}`);
  } catch (error) {
    toggleNotification({
      type: "warning",
      message: { id: "notification.error", defaultMessage: "An error occured" },
    });
  }
};
