import { useLocalStorage } from "usehooks-ts";
import { Venue } from "@diplomski/gql/graphql";
import { useCallback, useEffect, useMemo } from "react";
import ReactMapGl, { ViewState, Marker } from "react-map-gl";
import { gql, useQuery } from "urql";
import SearchBox from "./SearchBox";
import { useDebounce } from "usehooks-ts";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "../../public/pin.png";
import clsx from "clsx";

const DEFAULT_RANGE = 3000;
const DEFAULT_DEBOUNCE_TIME = 500;

const query = gql`
  query venuesInRange($fields: GetVenuesInRangeInput!) {
    venuesInRange(fields: $fields) {
      id
      name
      picture
      address
      latitude
      longitude
    }
  }
`;

interface Props {
  onChangeVisibleVenues: (venues: Venue[]) => void;
  highlightedId: string | null;
}

export default function Map({ onChangeVisibleVenues, highlightedId }: Props) {
  const [viewport, setViewport] = useLocalStorage<ViewState>("viewport", {
    latitude: 46.09167269144208,
    longitude: 19.66244234405549,
    zoom: 10,
    bearing: 0,
    pitch: 30,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

  const debouncedViewport = useDebounce(viewport, DEFAULT_DEBOUNCE_TIME);

  const [{ data }] = useQuery({
    query,
    variables: {
      fields: {
        latitude: debouncedViewport.latitude,
        longitude: debouncedViewport.longitude,
        range: DEFAULT_RANGE,
      },
    },
  });

  const onSelectAddress = useCallback(
    (_address: string, latitude: number | null, longitude: number | null) => {
      if (latitude && longitude) {
        setViewport((old) => ({
          ...old,
          latitude,
          longitude,
          zoom: 15,
        }));
      }
    },
    [setViewport]
  );

  const pins = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.venuesInRange.map((venue: Venue) => {
      const isHighlighted = venue.id === highlightedId;

      return (
        <Marker
          key={venue.id}
          latitude={venue.latitude}
          longitude={venue.longitude}
        >
          <div
            aria-label={venue.name}
            className={clsx(["w-10", "h-10", "ease-in", "transition-colors"], {
              "bg-red-500": isHighlighted,
              "bg-white": !isHighlighted,
            })}
            style={{
              maskImage: `url(${Pin.src})`, // Tailwind doesn't support mask-image
              maskMode: "alpha", // Tailwind doesn't support mask-mode
            }}
          ></div>
        </Marker>
      );
    });
  }, [data, highlightedId]);

  useEffect(() => {
    if (!data) {
      onChangeVisibleVenues([]);
      return;
    }

    onChangeVisibleVenues(data.venuesInRange);
  }, [data, onChangeVisibleVenues]);

  return (
    <div className="text-black relative">
      <ReactMapGl
        {...viewport}
        style={{ width: "100%", height: "calc(100vh - 64px)", cursor: "grab" }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onMove={({ viewState }) => setViewport(viewState)}
        minZoom={10}
        maxZoom={15}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
      >
        {pins}
        <div className="absolute top-0 w-full z-10 p-4">
          <SearchBox
            name="search"
            placeholder="Search your address"
            onSelectAddress={onSelectAddress}
          />
        </div>
      </ReactMapGl>
    </div>
  );
}
