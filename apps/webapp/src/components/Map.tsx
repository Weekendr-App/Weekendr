import { useState } from "react";
import ReactMapGl, { ViewState } from "react-map-gl";
import SearchBox from "./SearchBox";

export default function Map() {
  const [viewport, setViewport] = useState<ViewState>({
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

  return (
    <div className="text-black relative">
      <ReactMapGl
        {...viewport}
        style={{ width: "100%", height: "100vh", cursor: "grab" }}
        mapboxAccessToken="pk.eyJ1IjoieWVrbmEiLCJhIjoiY2xkN2Q0Mm1nMDZpMzN3bm9xMDZja2hzbCJ9.eO-bab6_tiQIxFpv7AoweQ"
        onMove={({ viewState }) => setViewport(viewState)}
        minZoom={10}
        maxZoom={15}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
      >
        <div className="absolute top-0 w-full z-10 p-4">
          <SearchBox
            onSelectAddress={(_address, latitude, longitude) => {
              if (latitude && longitude) {
                setViewport((old) => ({
                  ...old,
                  latitude,
                  longitude,
                  zoom: 15
                }));
              }
            }}
          />
        </div>
      </ReactMapGl>
    </div>
  );
}
