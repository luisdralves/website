export type State = {
  text: string;
  cursor: number;
  iter: number;
};

export type Action = { type: "KEY"; key: string };

export const initialState: State = {
  text: "",
  cursor: 0,
  iter: 0,
};

export const reducer = (state: State, action: Action): State => {
  const { text, cursor, iter } = state;
  const nextIter = iter + 1;

  switch (action.key) {
    case "Backspace": {
      if (cursor === 0) return state;
      return {
        text: text.slice(0, cursor - 1) + text.slice(cursor),
        cursor: cursor - 1,
        iter: nextIter,
      };
    }

    case "Delete": {
      if (cursor === text.length) return state;
      return {
        text: text.slice(0, cursor) + text.slice(cursor + 1),
        cursor,
        iter: nextIter,
      };
    }

    case "ArrowLeft": {
      if (cursor === 0) return state;
      return { ...state, cursor: cursor - 1, iter: nextIter };
    }

    case "ArrowRight": {
      if (cursor === text.length) return state;
      return { ...state, cursor: cursor + 1, iter: nextIter };
    }

    case "Home": {
      if (cursor === 0) return state;
      return { ...state, cursor: 0, iter: nextIter };
    }

    case "End": {
      if (cursor === text.length) return state;
      return { ...state, cursor: text.length, iter: nextIter };
    }

    case "PageUp": {
      const prevNewline = text.lastIndexOf("\n", cursor - 1);
      const newCursor = prevNewline + 1;
      if (newCursor === cursor) return state;
      return { ...state, cursor: newCursor, iter: nextIter };
    }

    case "PageDown": {
      const nextNewline = text.indexOf("\n", cursor);
      const newCursor = nextNewline === -1 ? text.length : nextNewline;
      if (newCursor === cursor) return state;
      return { ...state, cursor: newCursor, iter: nextIter };
    }

    case "Enter":
      return {
        text: `${text.slice(0, cursor)}\n${text.slice(cursor)}`,
        cursor: cursor + 1,
        iter: nextIter,
      };

    default: {
      if (action.key.length === 1) {
        return {
          text: text.slice(0, cursor) + action.key + text.slice(cursor),
          cursor: cursor + 1,
          iter: nextIter,
        };
      }
      return state;
    }
  }
};
