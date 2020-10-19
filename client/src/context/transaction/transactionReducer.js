import {
  GET_TRANSACTIONS,
  GET_TRANSACTION,
  ADD_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
  SET_CURRENT,
  CLEAR_CURRENT,
  CLEAR_TRANSACTIONS,
  TRANSACTION_ERROR
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
        loading: false
      };
    case GET_TRANSACTION:
      return {
        ...state,
        transaction: action.payload,
        loading: false
      };
    case ADD_TRANSACTION:
      return {
        // ...state,
        // transactions: [action.payload, ...state.transactions],
        ...state,
        transaction: action.payload,
        loading: false
      };
    case UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t._id === action.payload._id ? action.payload : t
        ),
        loading: false
      };
    case DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(
          t => t._id !== action.payload
        ),
        loading: false
      };
    case CLEAR_TRANSACTIONS:
      return {
        ...state,
        transactions: null,
        error: null,
        current: null
      };
    case SET_CURRENT:
      return {
        ...state,
        transaction: action.payload
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        transaction: null
      };
    case TRANSACTION_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
