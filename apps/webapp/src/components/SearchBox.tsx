import { ChangeEvent, useCallback, useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useGoogleMapsScript, Libraries } from "use-google-maps-script";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { Props } from "./Form/Input";
import clsx from "clsx";
import { useDarkMode } from "usehooks-ts";

interface SearchBoxProps extends Partial<Omit<Props, "type" | "onChange">> {
  onSelectAddress: (
    address: string,
    latitude: number | null,
    longitude: number | null
  ) => void;
}

const libraries: Libraries = ["places"];

export default function SearchBox(props: SearchBoxProps) {
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ?? "",
    libraries,
  });

  if (!isLoaded) return null;
  if (loadError) return <div>Error loading</div>;

  return <ReadySearchBox {...props} />;
}

function ReadySearchBox({
  name,
  label,
  value: defaultValue,
  error,
  placeholder,
  onSelectAddress,
}: SearchBoxProps) {
  const { isDarkMode } = useDarkMode();
  const {
    value,
    ready,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300 });

  useEffect(() => {
    if (defaultValue) {
      setValue(`${defaultValue}`, false);
    }
  }, [defaultValue, setValue]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (e.target.value === "") {
        onSelectAddress("", null, null);
      }
    },
    [onSelectAddress, setValue]
  );

  const handleSelect = useCallback(
    async (address: string) => {
      setValue(address, false);
      clearSuggestions();

      try {
        const results = await getGeocode({ address });
        const { lat, lng } = getLatLng(results[0]);
        onSelectAddress(address, lat, lng);
      } catch (error) {
        console.error(`😱 Error:`, error);
      }
    },
    [setValue, clearSuggestions, onSelectAddress]
  );

  return (
    <Combobox className="w-full sm:w-auto" onSelect={handleSelect}>
      {label && (
        <label htmlFor={name} className="font-bold">
          {label}
        </label>
      )}
      <ComboboxInput
        id={name}
        value={value}
        onChange={handleChange}
        disabled={!ready}
        placeholder={placeholder}
        className={clsx(
          ["w-full", "p-2", "border", "rounded", "border-gray-300"],
          {
            "border-red-500": error,
            "text-black": isDarkMode,
          }
        )}
        autoComplete="off"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
      {error && <span className="italic text-red-500">{error}</span>}
    </Combobox>
  );
}
