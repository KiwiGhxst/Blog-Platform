const emailValidation = {
  required: 'Email is required',
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Invalid email address',
  },
};

const passwordValidation = (minLength = 6, maxLength = 40) => ({
  required: 'Password is required',
  minLength: { value: minLength, message: `Password must be at least ${minLength} characters long` },
  maxLength: { value: maxLength, message: `Password cannot exceed ${maxLength} characters` },
});

const urlValidation = {
  pattern: {
    value: /^(https?:\/\/[^\s]+)$/,
    message: 'Please enter a valid URL',
  },
};

const createField = (name, label, placeholder, validation, type = 'text') => ({
  name,
  label,
  placeholder,
  type,
  validation,
});

export const editProfileFields = [
  createField('username', 'Username', 'Username', {
    required: 'Username is required',
    minLength: { value: 3, message: 'Must be at least 3 characters' },
    maxLength: { value: 20, message: 'Cannot exceed 20 characters' },
  }),

  createField('email', 'Email address', 'Email address', emailValidation, 'email'),

  createField('password', 'New password', 'Password', passwordValidation(6, 40), 'password'),

  createField('image', 'Avatar image (url)', 'Avatar image', urlValidation),
];

export const registerFields = [
  createField('username', 'Username', 'Username', {
    required: 'Username is required',
    minLength: { value: 3, message: 'Username must be at least 3 characters long' },
    maxLength: { value: 20, message: 'Username cannot exceed 20 characters' },
  }),

  createField('email', 'Email address', 'Email address', emailValidation, 'email'),

  createField('password', 'Password', 'Password', passwordValidation(6, 40), 'password'),

  createField(
    'repeatPas',
    'Repeat Password',
    'Repeat Password',
    {
      required: 'Please repeat your password',
      validate: (value, getValues) => {
        const { password } = getValues();
        return value === password || 'Passwords must match';
      },
    },
    'password'
  ),

  {
    name: 'checkbox',
    label: '',
    placeholder: '',
    type: 'checkbox',
    validation: {
      required: 'You must agree to the processing of personal data',
    },
    customLabel: 'I agree to the processing of my personal information',
  },
];

export const loginFields = [
  createField('email', 'Email address', 'Email address', emailValidation, 'email'),

  createField('password', 'Password', 'Password', { required: 'Password is required' }, 'password'),
];
