import { useLocation, useNavigate } from "react-router-dom";

const useToggleModal = (locationStateProp: string) => {
  const location = useLocation();
  const nav = useNavigate();

  const toggleActive = (open: boolean) => {
    if (open) {
      const replace = window.history.length > 2;
      const state = { ...location.state, [locationStateProp]: true };

      nav(location.pathname + location.search + location.hash, {
        state,
        relative: "path",
        replace,
      });
    } else {
      const state = location.state;
      delete state[locationStateProp];

      nav(location.pathname, {
        state: { ...location.state },
        replace: true,
        relative: "path",
      });
    }
  };

  const open = location.state?.[locationStateProp] === true;

  return [open, toggleActive] as const;
};

export default useToggleModal;
