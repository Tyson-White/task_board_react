import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import { useMemo } from "react";
import { actions as boards } from "../slices/boardSlice";
import { actions as popups } from "../slices/popupSlice";

const rootActions = {
  ...boards,
  ...popups,
};

export function useActions() {
  const dispatch = useDispatch();
  return useMemo(() => {
    if (Array.isArray(rootActions)) {
      return rootActions.map((a) => bindActionCreators(a, dispatch));
    }
    return bindActionCreators(rootActions, dispatch);
  });
}
