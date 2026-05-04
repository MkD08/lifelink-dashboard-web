import { api } from "../../../lib/axios";

export const collectesService = {
  async getAll() {
    const res = await api.get("/collectes");
    return res.data.data;
  },

  async create(data: FormData) {
    return api.post("/collectes", data);
  },

  async update(id: number, data: FormData) {
    return api.put(`/collectes/${id}`, data);
  },

  async delete(id: number) {
    return api.delete(`/collectes/${id}`);
  },

  async participer(id: number, utilisateur_id: number) {
    return api.post(`/collectes/${id}/participer`, {
      utilisateur_id,
    });
  },
};