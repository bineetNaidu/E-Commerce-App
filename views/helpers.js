module.exports = {
    getError: (errors, prop) => {
        // prop === 'email' || 'password'
        try {
            return errors.mapped()[prop].msg;
        } catch (error) {
            return "";
        }
    },
};
