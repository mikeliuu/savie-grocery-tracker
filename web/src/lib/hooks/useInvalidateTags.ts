import { useDispatch } from "react-redux";

export const useInvalidateTags = () => {
  const dispatch = useDispatch();

  const invalidateTags = (apiReducerPath: unknown, tags: string[]) => {
    dispatch({
      type: `${apiReducerPath}/invalidateTags`,
      payload: [...tags],
    });
  };
  return {
    invalidateTags,
  };
};
