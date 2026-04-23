export const loginValidate = ({
  email,
  password,
  setErrors,
}: {
  email: string;
  password: string;
  setErrors: (e: { email?: string; password?: string }) => void;
}) => {
  const e: { email?: string; password?: string } = {};

  if (!email.trim()) e.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';

  if (!password) e.password = 'Password is required';
  else if (password.length < 6) e.password = 'At least 6 characters';

  setErrors(e);

  return Object.keys(e).length === 0;
};
