import autoprefixer from "autoprefixer";
import clsx from "clsx";
import { sync } from "postcss-js";
import { FC, useMemo } from "react";
import ReactMapGl, { Marker, ViewState } from "react-map-gl";
import Pin from "@weekendr/public/pin.png";
import "mapbox-gl/dist/mapbox-gl.css";
import { Venue } from "@weekendr/src/gql/graphql";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  viewport: ViewState;
  venues: Venue[];
}

const prefixer = sync([autoprefixer]);

const StaticMap: FC<Props> = ({ viewport, venues }) => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const pins = useMemo(() => {
    return venues.map((location) => (
      <Marker
        key={location.latitude + location.longitude}
        latitude={location.latitude}
        longitude={location.longitude}
      >
        <div
          className={clsx(["w-10", "h-10", "mx-auto", "bg-white"])}
          style={prefixer({
            maskImage: `url(${Pin.src})`,
            maskMode: "alpha",
          })}
        ></div>
        <span className="text-white text-xs">{location.name}</span>
      </Marker>
    ));
  }, [venues]);

  return (
    <ReactMapGl
      {...viewport}
      style={{
        width: "100%",
        height: isSmallScreen ? "calc(100vh / 2 - 32px)" : "calc(100vh - 64px)",
      }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
      minZoom={10}
      maxZoom={15}
      mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
    >
      {pins}
    </ReactMapGl>
  );
};

export default StaticMap;
