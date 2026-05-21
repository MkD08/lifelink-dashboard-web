import {
    mauritaniaLocations,
  } from "../../config/mauritania-locations";
  
  type Props = {
    ville: string;
  
    quartier: string;
  
    onVilleChange: (
      value: string
    ) => void;
  
    onQuartierChange: (
      value: string
    ) => void;
  
    disabled?: boolean;
  };
  
  export default function LocationSelect({
    ville,
  
    quartier,
  
    onVilleChange,
  
    onQuartierChange,
  
    disabled = false,
  }: Props) {
    const villes = Object.keys(
      mauritaniaLocations
    );
  
    const quartiers =
      mauritaniaLocations[
        ville as keyof typeof mauritaniaLocations
      ] || [];
  
    return (
      <div className="grid gap-4 md:grid-cols-2">
  
        {/* VILLE */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
            Ville
          </label>
  
          <input
            type="text"
            list="cities-list"
            value={ville}
            disabled={disabled}
            placeholder="Sélectionner une ville"
            onChange={(e) => {
              onVilleChange(
                e.target.value
              );
  
              onQuartierChange("");
            }}
            className="
              w-full
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              transition
              focus:border-red-500
  
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
  
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
  
          <datalist id="cities-list">
            {villes.map((city) => (
              <option
                key={city}
                value={city}
              />
            ))}
          </datalist>
        </div>
  
        {/* QUARTIER */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
            Quartier
          </label>
  
          <input
            type="text"
            list="quartiers-list"
            value={quartier}
            disabled={
              disabled || !ville
            }
            placeholder={
              ville
                ? "Sélectionner un quartier"
                : "Choisir d’abord une ville"
            }
            onChange={(e) =>
              onQuartierChange(
                e.target.value
              )
            }
            className="
              w-full
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              transition
              focus:border-red-500
  
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
  
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
  
          <datalist id="quartiers-list">
            {quartiers.map(
              (quartierName) => (
                <option
                  key={quartierName}
                  value={quartierName}
                />
              )
            )}
          </datalist>
        </div>
      </div>
    );
  }