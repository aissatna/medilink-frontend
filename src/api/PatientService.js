import axios from "axios";  

const PATIENT_API_BASE_URL = 'http://localhost:8070/medilink/patients';

export default {
    getPatients: function(pageNumber, pageSize, sortBy, search) {
        const params = new URLSearchParams({
            page: pageNumber,
            size: pageSize,
        });
        if (sortBy.length) {
            params.append('sort', `${sortBy[0].key},${sortBy[0].order}`);
        }
        if (search) {
            params.append('search', search);
        }
        return axios.get(`${PATIENT_API_BASE_URL}/table`, { params });
    },

    addNewPatient: function(patient) {
        return axios.post(`${PATIENT_API_BASE_URL}/add`, patient);
    },

    deletePatient: function(patientId) {
        return axios.delete(`${PATIENT_API_BASE_URL}/delete/${patientId}`);
    },

};