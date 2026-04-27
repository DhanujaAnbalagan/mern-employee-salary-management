// Uses inline string constants to keep the file self-contained.
// The action creators in dataLemburAction/index.js dispatch the same strings.

const initialState = {
    dataLembur: [],
    loading   : true,
    error     : null,
    message   : ''
};

const dataLemburReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_DATA_LEMBUR_SUCCESS':
            return { ...state, dataLembur: action.payload, loading: false, error: null };
        case 'GET_DATA_LEMBUR_FAILURE':
            return { ...state, dataLembur: [], loading: false, error: action.payload };

        case 'GET_DATA_LEMBUR_BY_ID_SUCCESS':
            return { ...state, dataLembur: action.payload, loading: false, error: null };
        case 'GET_DATA_LEMBUR_BY_ID_FAILURE':
            return { ...state, loading: false, error: action.payload };

        case 'CREATE_DATA_LEMBUR_SUCCESS':
            return { ...state, message: action.payload, loading: false, error: null };
        case 'CREATE_DATA_LEMBUR_FAILURE':
            return { ...state, message: '', loading: false, error: action.payload };

        case 'UPDATE_DATA_LEMBUR_SUCCESS':
            return { ...state, message: action.payload, loading: false, error: null };
        case 'UPDATE_DATA_LEMBUR_FAILURE':
            return { ...state, message: '', loading: false, error: action.payload };

        case 'DELETE_DATA_LEMBUR_SUCCESS':
            return { ...state, message: action.payload, loading: false, error: null };
        case 'DELETE_DATA_LEMBUR_FAILURE':
            return { ...state, message: '', loading: false, error: action.payload };

        default:
            return state;
    }
};

export default dataLemburReducer;
export { dataLemburReducer };
