import axios from 'axios';

const API_URL = 'http://localhost:5000';

// ── GET all ──────────────────────────────────────────────────────────────────
export const getDataLembur = () => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/data_lembur`);
        dispatch({ type: 'GET_DATA_LEMBUR_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'GET_DATA_LEMBUR_FAILURE', payload: error.message });
    }
};

// ── GET by ID ─────────────────────────────────────────────────────────────────
export const getDataLemburById = (id) => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/data_lembur/${id}`);
        dispatch({ type: 'GET_DATA_LEMBUR_BY_ID_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'GET_DATA_LEMBUR_BY_ID_FAILURE', payload: error.message });
    }
};

// ── CREATE ────────────────────────────────────────────────────────────────────
// navigate is passed so the action can redirect after a successful save,
// matching the pattern used in createDataPegawai.
export const createDataLembur = (formData, navigate) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_URL}/data_lembur`, formData);
        dispatch({ type: 'CREATE_DATA_LEMBUR_SUCCESS', payload: response.data });
        navigate('/data-lembur');
        return response.data;
    } catch (error) {
        dispatch({ type: 'CREATE_DATA_LEMBUR_FAILURE', payload: error.message });
        throw error;
    }
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updateDataLembur = (id, formData) => async (dispatch) => {
    try {
        const response = await axios.patch(`${API_URL}/data_lembur/update/${id}`, formData);
        dispatch({ type: 'UPDATE_DATA_LEMBUR_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_DATA_LEMBUR_FAILURE', payload: error.message });
    }
};

// ── DELETE ────────────────────────────────────────────────────────────────────
export const deleteDataLembur = (id) => async (dispatch) => {
    try {
        const response = await axios.delete(`${API_URL}/data_lembur/${id}`);
        dispatch({ type: 'DELETE_DATA_LEMBUR_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'DELETE_DATA_LEMBUR_FAILURE', payload: error.message });
    }
};
