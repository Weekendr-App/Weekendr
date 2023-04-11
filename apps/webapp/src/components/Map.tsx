import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import { Venue } from "@diplomski/gql/graphql";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMapGl, {
  ViewState,
  Marker,
  MapRef,
  LngLatBounds,
  ViewStateChangeEvent,
} from "react-map-gl";
import { gql, useQuery } from "urql";
import SearchBox from "./SearchBox";
import { useDebounce } from "usehooks-ts";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "../../public/pin.png";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useMapHover } from "@diplomski/hooks/useMapHover";
import { sync } from "postcss-js";
import autoprefixer from "autoprefixer";

const DEFAULT_DEBOUNCE_TIME = 500;

const query = gql`
  query venuesInRange($fields: GetVenuesInRangeInput!) {
    venuesInRange(fields: $fields) {
      id
      name
      picture
      isOwnedByMe
      address
      latitude
      longitude
      status
    }
  }
`;

const prefixer = sync([autoprefixer]);

interface Props {
  onChangeVisibleVenues: (venues: Venue[]) => void;
}

export default function Map({ onChangeVisibleVenues }: Props) {
  const router = useRouter();
  const { setHighlightedVenueId, isHighlighted } = useMapHover();
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
  const mapRef = useRef<MapRef | null>(null);
  const [mapBounds, setMapBounds] = useState<LngLatBounds | null>(null);

  const debouncedBounds = useDebounce(mapBounds, DEFAULT_DEBOUNCE_TIME);

  const [{ data }] = useQuery({
    query,
    pause: !debouncedBounds,
    variables: {
      fields: {
        bounds: JSON.stringify(debouncedBounds),
      },
    },
  });

  const pins = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.venuesInRange.map((venue: Venue) => {
      return (
        <div className="z-10" key={venue.id}>
          <Marker
            key={venue.id}
            latitude={venue.latitude}
            longitude={venue.longitude}
          >
            <div
              aria-label={venue.name}
              className={clsx(["w-10", "h-10", "hover:cursor-pointer"], {
                "bg-red-500": isHighlighted(venue.id) && !venue.isOwnedByMe,
                "bg-amber-300": isHighlighted(venue.id) && venue.isOwnedByMe,
                "bg-white": !isHighlighted(venue.id),
                "hover:bg-red-500": !venue.isOwnedByMe,
                "hover:bg-amber-300": venue.isOwnedByMe,
              })}
              style={prefixer({
                maskImage: `url(${Pin.src})`, // Tailwind doesn't support mask-image
                maskMode: "alpha", // Tailwind doesn't support mask-mode
              })}
              onClick={() => router.push(`/venues/${venue.id}`)}
              onMouseEnter={() => setHighlightedVenueId(venue.id)}
              onMouseLeave={() => setHighlightedVenueId(null)}
            ></div>
          </Marker>
        </div>
      );
    });
  }, [data, router, setHighlightedVenueId, isHighlighted]);

  const calculateMapBounds = useCallback(() => {
    if (mapRef.current) {
      setMapBounds(mapRef.current.getMap().getBounds());
    }
  }, [mapRef, setMapBounds]);

  const onMove = useCallback(
    (e: ViewStateChangeEvent) => {
      if (e.viewState) {
        setViewport(e.viewState);
      }
    },
    [setViewport]
  );

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

  useEffectOnce(() => {
    const localViewport = localStorage.getItem("viewport");

    if (!localViewport) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { longitude, latitude } }) => {
          setViewport((old) => ({
            ...old,
            latitude,
            longitude,
            zoom: 13,
          }));
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  });

  useEffect(() => {
    if (!data) {
      onChangeVisibleVenues([]);
      return;
    }

    onChangeVisibleVenues(data.venuesInRange);
  }, [data, onChangeVisibleVenues]);

  useEffect(() => {
    calculateMapBounds();
  }, [calculateMapBounds, viewport]);

  return (
    <div className="text-black relative">
      <ReactMapGl
        {...viewport}
        style={{ width: "100%", height: "calc(100vh - 64px)", cursor: "grab" }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onMove={onMove}
        onLoad={calculateMapBounds}
        minZoom={10}
        maxZoom={15}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        ref={mapRef}
      >
        {pins}
        <div className="absolute top-0 w-full z-20 p-4">
          <SearchBox
            name="search"
            placeholder={"Search for an address"}
            onSelectAddress={onSelectAddress}
          />
        </div>
      </ReactMapGl>
    </div>
  );
}
