import { request } from "./movies.js";

export const getActors = () => request("/admin/actors");

export const createActor = (payload) =>
  request("/admin/actor", { method: "POST", body: JSON.stringify(payload) });

export const updateActor = (id, payload) =>
  request(`/admin/actor/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteActor = (id) =>
  request(`/admin/actor/${id}`, { method: "DELETE" });
