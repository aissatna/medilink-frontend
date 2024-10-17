
export const validationRules = {
    required: v => !!v || 'This field is required',
    ssn: v => /^\d{9}$/.test(v) || 'SSN must be 9 digits',
    phone: v => /^\d{10}$/.test(v) || 'Phone number must be 10 digits',
    email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    date: v => /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/.test(v) || 'Date must be in DD/MM/YYYY format',
};