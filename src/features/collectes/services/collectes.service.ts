import { api } from "../../../lib/axios";

import type {
  Collecte,
  CollectesApiResponse,
} from "../types/collecte.types";

/**
 * ==============================
 * SERVICE COLLECTES
 * ==============================
 */

export const collectesService = {

  // ==============================
  // BACKOFFICE
  // ADMIN / STAFF / DIRECTEUR
  // ==============================
  async getAll(): Promise<Collecte[]> {

    try {

      const res =
        await api.get<CollectesApiResponse>(
          "/collectes/backoffice"
        );

      return (
        res.data?.data || []
      );

    } catch (err: any) {

      console.error(
        "❌ GET COLLECTES ERROR:",
        err
      );

      throw new Error(

        err?.response?.data
          ?.message ||

        "Impossible de charger les collectes"
      );
    }
  },

  // ==============================
  // CREATE
  // ==============================
  async create(
    data: any
  ) {

    try {

      console.log(
        "🚀 CREATE DATA:",
        data
      );

      const res =
        await api.post(
          "/collectes",
          data
        );

      return res.data;

    } catch (err: any) {

      console.error(
        "❌ CREATE COLLECTE ERROR:",
        err
      );

      console.error(
        "❌ SERVER:",
        err?.response?.data
      );

      throw new Error(

        err?.response?.data
          ?.message ||

        "Création impossible"
      );
    }
  },

  // ==============================
  // UPDATE
  // ==============================
  async update(
    id: number,
    data: any
  ) {

    try {

      console.log(
        "🚀 UPDATE DATA:",
        data
      );

      const res =
        await api.put(
          `/collectes/${id}`,
          data
        );

      return res.data;

    } catch (err: any) {

      console.error(
        "❌ UPDATE COLLECTE ERROR:",
        err
      );

      console.error(
        "❌ SERVER:",
        err?.response?.data
      );

      throw new Error(

        err?.response?.data
          ?.message ||

        "Modification impossible"
      );
    }
  },

  // ==============================
  // DELETE
  // ==============================
  async delete(
    id: number
  ) {

    try {

      const res =
        await api.delete(
          `/collectes/${id}`
        );

      return res.data;

    } catch (err: any) {

      console.error(
        "❌ DELETE COLLECTE ERROR:",
        err
      );

      throw new Error(

        err?.response?.data
          ?.message ||

        "Suppression impossible"
      );
    }
  },

  // ==============================
  // PARTICIPER
  // MOBILE USER
  // ==============================
  async participer(
    id: number,
    utilisateur_id: number
  ) {

    try {

      const res =
        await api.post(
          `/collectes/${id}/participer`,
          {
            utilisateur_id,
          }
        );

      return res.data;

    } catch (err: any) {

      console.error(
        "❌ PARTICIPATION ERROR:",
        err
      );

      throw new Error(

        err?.response?.data
          ?.message ||

        "Participation impossible"
      );
    }
  },
};