import { useCallback } from "react";
import ReactMapGl, { ViewState } from "react-map-gl";
import SearchBox from "./SearchBox";
import { useLocalStorage } from "usehooks-ts";

export default function Map() {
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
    []
  );

  return (
    <div className="text-black relative">
      <ReactMapGl
        {...viewport}
        style={{ width: "100%", height: `calc(100vh - 64px)`, cursor: "grab" }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onMove={({ viewState }) => setViewport(viewState)}
        minZoom={10}
        maxZoom={15}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
      >
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
