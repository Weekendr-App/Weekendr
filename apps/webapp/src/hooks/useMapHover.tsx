import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface Props {
  children: ReactNode;
}

interface MapHoverContextProps {
  highlightedVenueId: string | null;
  setHighlightedVenueId: (id: string | null) => void;
  isHighlighted: (id: string | null) => boolean;
}

const MapHoverContext = createContext<MapHoverContextProps>({
  highlightedVenueId: null,
  setHighlightedVenueId: () => {},
  isHighlighted: () => false,
});

export const MapHoverProvider: FC<Props> = ({ children }) => {
  const [highlightedVenueId, setHighlightedVenueId] = useState<string | null>(
    null
  );
  const isHighlighted = useCallback(
    (id: string | null) => {
      if (id) {
        return highlightedVenueId === id;
      }
      return false;
    },
    [highlightedVenueId]
  );

  return (
    <MapHoverContext.Provider
      value={{
        highlightedVenueId,
        setHighlightedVenueId,
        isHighlighted,
      }}
    >
      {children}
    </MapHoverContext.Provider>
  );
};

export const useMapHover = () => useContext(MapHoverContext);
