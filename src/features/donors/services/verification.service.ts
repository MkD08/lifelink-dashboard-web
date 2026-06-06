import { api } from "../../../lib/axios";

export const verificationService = {
    //Admin General
    async getAllVerifiedUsers() {
        const response = await api.get(
          "/users/verified-all"
        );
      
        return response.data.data;
      },
  /**
   * Utilisateurs à vérifier
   */
  async getUsersToVerify() {
    const response = await api.get(
      "/users/to-verify"
    );

    return response.data.data;
  },

  /**
   * Utilisateurs vérifiés
   */
  async getVerifiedUsers() {
    const response = await api.get(
      "/users/verified"
    );

    return response.data.data;
  },

  /**
   * Vérifier groupe sanguin
   */
  async verifyBloodGroup(
    userId: number,
    groupeSanguin: string
  ) {
    const response = await api.patch(
      `/users/${userId}/verify-blood-group`,
      {
        groupe_sanguin: groupeSanguin,
      }
    );

    return response.data;
  },

};