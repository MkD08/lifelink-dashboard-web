import { useEffect, useState } from "react";

import { useToast } from "../../auth/store/toast.store";

import { adminsService } from "../services/admins.service";

import UpdateMyProfileModal from "../components/UpdateMyProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

export default function MyAdminProfilePage() {
  const { showToast } = useToast();

  const [isProfileModalOpen, setIsProfileModalOpen] =
    useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(false);

  const [profileForm, setProfileForm] =
    useState({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      ville: "",
      quartier: "",
      groupe_sanguin: "",
    });

  const [passwordForm, setPasswordForm] =
    useState({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });

  const [loadingProfile, setLoadingProfile] =
    useState(false);

  const [loadingPassword, setLoadingPassword] =
    useState(false);

  const loadProfile = async () => {
    try {
      const profile =
        await adminsService.getMyProfile();

      setProfileForm({
        nom: profile.nom ?? "",
        prenom: profile.prenom ?? "",
        telephone:
          profile.telephone ?? "",
        email: profile.email ?? "",
        ville: profile.ville ?? "",
        quartier:
          profile.quartier ?? "",
        groupe_sanguin:
          profile.groupe_sanguin ?? "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileUpdate =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setLoadingProfile(true);

        await adminsService.updateMyProfile(
          profileForm
        );

        await loadProfile();

        setIsProfileModalOpen(false);

        showToast(
          "Profil mis à jour avec succès.",
          "success"
        );
      } catch (err) {
        showToast(
          err instanceof Error
            ? err.message
            : "Erreur",
          "error"
        );
      } finally {
        setLoadingProfile(false);
      }
    };

  const handlePasswordChange =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (
        passwordForm.new_password !==
        passwordForm.confirm_password
      ) {
        showToast(
          "Les mots de passe ne correspondent pas.",
          "error"
        );

        return;
      }

      try {
        setLoadingPassword(true);

        await adminsService.changePassword({
          old_password:
            passwordForm.old_password,

          new_password:
            passwordForm.new_password,
        });

        setPasswordForm({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });

        setIsPasswordModalOpen(false);

        showToast(
          "Mot de passe modifié avec succès.",
          "success"
        );
      } catch (err) {
        showToast(
          err instanceof Error
            ? err.message
            : "Erreur",
          "error"
        );
      } finally {
        setLoadingPassword(false);
      }
    };

  const updateProfileField = (
    key: string,
    value: string
  ) => {
    setProfileForm(
      (prev) => ({
        ...prev,
        [key]: value,
      })
    );
  };

  const updatePasswordField = (
    key: string,
    value: string
  ) => {
    setPasswordForm(
      (prev) => ({
        ...prev,
        [key]: value,
      })
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Mon profil
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Consultez vos informations personnelles
            et gérez la sécurité de votre compte.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {/* PROFIL */}

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Informations personnelles
            </h2>

            <div className="mt-6 space-y-4">
              <InfoRow
                label="Nom"
                value={profileForm.nom}
              />

              <InfoRow
                label="Prénom"
                value={profileForm.prenom}
              />

              <InfoRow
                label="Email"
                value={profileForm.email}
              />

              <InfoRow
                label="Téléphone"
                value={
                  profileForm.telephone
                }
              />

              <InfoRow
                label="Ville"
                value={profileForm.ville}
              />

              <InfoRow
                label="Quartier"
                value={
                  profileForm.quartier
                }
              />

              <InfoRow
                label="Groupe sanguin"
                value={
                  profileForm.groupe_sanguin ||
                  "-"
                }
              />
            </div>

            <button
              onClick={() =>
                setIsProfileModalOpen(
                  true
                )
              }
              className="mt-6 rounded-2xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
            >
              Modifier mon profil
            </button>
          </div>

          {/* SECURITE */}

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Sécurité du compte
            </h2>

            <div className="mt-6 space-y-4">
              <InfoRow
                label="Mot de passe"
                value="••••••••••"
              />

              <InfoRow
                label="Statut"
                value="Compte actif"
              />
            </div>

            <button
              onClick={() =>
                setIsPasswordModalOpen(
                  true
                )
              }
              className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
            >
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>

      <UpdateMyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() =>
          setIsProfileModalOpen(false)
        }
        loading={loadingProfile}
        profileForm={profileForm}
        updateField={updateProfileField}
        onSubmit={handleProfileUpdate}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() =>
          setIsPasswordModalOpen(false)
        }
        loading={loadingPassword}
        passwordForm={passwordForm}
        updateField={updatePasswordField}
        onSubmit={handlePasswordChange}
      />
    </>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="font-semibold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}