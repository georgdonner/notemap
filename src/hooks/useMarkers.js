import { useEffect, useReducer } from "react";
import { useFirestore } from "reactfire";

function reducer(state, action) {
  switch (action.type) {
    case "mapFetched":
      if (!state.mapsFetched.includes(action.mapID)) {
        return {
          ...state,
          mapsFetched: state.mapsFetched.concat(action.mapID),
        };
      }
      return state;
    case "added":
      return { ...state, markers: state.markers.concat(action.markers) };
    case "modified":
      return {
        ...state,
        markers: state.markers.map((marker) =>
          marker.id === action.marker.id ? action.marker : marker
        ),
      };
    case "removed":
      return {
        ...state,
        markers: state.markers.filter(
          (marker) => marker.id !== action.marker.id
        ),
      };
    default:
      throw new Error();
  }
}

function useMarkers(maps) {
  const firestore = useFirestore();
  const [state, dispatch] = useReducer(reducer, {
    markers: [],
    mapsFetched: [],
  });

  useEffect(() => {
    const unsubscribers = [];

    maps.forEach((map) => {
      const unsubscribe = firestore
        .collection(`maps/${map.id}/markers`)
        .onSnapshot((querySnapshot) => {
          const added = [];
          querySnapshot.docChanges().forEach(({ type, doc }) => {
            const marker = {
              ...doc.data(),
              id: doc.id,
              map,
            };
            if (type === "added") {
              added.push(marker);
            } else {
              dispatch({ type, marker });
            }
          });
          if (added.length) {
            dispatch({ type: "added", markers: added });
          }
          dispatch({ type: "mapFetched", mapID: map.id });
        });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, []); // eslint-disable-line

  return state;
}

export default useMarkers;
