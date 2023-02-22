import { Venue as VenueType } from "@diplomski/gql/graphql";
import clsx from "clsx";
import { FC } from "react";

interface Props {
  venue: VenueType;
}

const Venue: FC<Props> = ({ venue }) => {
  return (
    <div className={clsx(["p-4", "border-2", "rounded"])}>
      <h1>{venue.name}</h1>
    </div>
  );
};

export default Venue;
