import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
            'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
        ),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords do not match'),
    firstName: Yup.string()
        .required('First name is required')
        .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Invalid first name'),

    lastName: Yup.string()
        .required('Last name is required')
        .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Invalid last name'),
    profilePhoto: Yup.string(),
});
