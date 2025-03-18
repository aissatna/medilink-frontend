const MAX_FILE_SIZE_BYTES = 10000000; // 10 MB in bytes

export const validationRules = {
    required: v => !!v || 'This field is required',
    ssn: v => /^\d{9}$/.test(v) || 'SSN must be 9 digits',
    phone: v => /^\d{10}$/.test(v) || 'Phone number must be 10 digits',
    email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    date: v => /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/.test(v) || 'Date must be in DD/MM/YYYY format',
    avatarSize: v => {
        // If no file is selected, validation passes
        if (!v || !v[0]) return true;
        // Check file size for the first file in the array
        return v[0].size <= MAX_FILE_SIZE_BYTES || 'Avatar file size should be less than 10 MB';
    },
    avatarType: v => {
        // If no file is selected, validation passes
        if (!v || !v[0]) return true;
        // Check file type for the first file in the array
        return ['image/png', 'image/jpeg', 'image/gif'].includes(v[0].type) || 'Avatar must be PNG, JPEG, or GIF';
    },
};