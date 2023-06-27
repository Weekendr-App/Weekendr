import autoprefixer from "autoprefixer";
import clsx from "clsx";
import { sync } from "postcss-js";
import { FC, useMemo } from "react";
import ReactMapGl, { Marker, ViewState } from "react-map-gl";
import Pin from "../../public/pin.png";
import "mapbox-gl/dist/mapbox-gl.css";
import { Venue } from "@diplomski/gql/graphql";
import { useDarkMode, useMediaQuery } from "usehooks-ts";

interface Props {
  viewport: ViewState;
  venues: Venue[];
}

const prefixer = sync([autoprefixer]);

const StaticMap: FC<Props> = ({ viewport, venues }) => {
  const isPhone = useMediaQuery("(max-width: 640px)");
  const { isDarkMode } = useDarkMode();
  const pins = useMemo(() => {
    return venues.map((location) => (
      <Marker
        key={location.latitude + location.longitude}
        latitude={location.latitude}
        longitude={location.longitude}
      >
        <div
          className={clsx(["w-10", "h-10", "mx-auto"], {
            "bg-red-500": !isDarkMode,
            "bg-white": isDarkMode,
          })}
          style={prefixer({
            maskImage: `url(${Pin.src})`,
            maskMode: "alpha",
          })}
        ></div>
        <span className="dark:text-white text-xs">{location.name}</span>
      </Marker>
    ));
  }, [venues, isDarkMode]);

  return (
    <ReactMapGl
      {...viewport}
      style={{
        width: "100%",
        height: isPhone ? "calc(100vh / 2 - 32px)" : "calc(100vh - 64px)",
      }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
      minZoom={10}
      maxZoom={15}
      mapStyle={
        isDarkMode
          ? "mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
          : "mapbox://styles/mapbox/navigation-day-v1"
      }
    >
      {pins}
    </ReactMapGl>
  );
};

export default StaticMap;
