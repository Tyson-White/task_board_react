import { useSelector } from "react-redux";

export const useBoards = () => {
  const boards = useSelector((state) => state.boards);

  return { boards };
};
