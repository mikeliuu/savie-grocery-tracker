import { useEffect, useState } from "react";

function useToggle() {
  const [open, setOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setOpen(true);
  };

  const toggleClose = () => {
    setOpen(false);
  };

  const toggle = () => {
    setOpen((state) => !state);
  };

  return { open, toggleOpen, toggleClose, toggle };
}

export default useToggle;
