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

export const registerValidate = ({
  name,
  email,
  phone,
  password,
  confirm,
  setErrors,
}: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  setErrors: (e: Record<string, string>) => void;
}) => {
  const e: Record<string, string> = {};

  if (!name.trim()) e.name = 'Name is required';
  if (!email.trim()) e.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
  if (phone && !/^[6-9]\d{9}$/.test(phone))
    e.phone = 'Enter a valid 10-digit Indian mobile number';
  if (!password) e.password = 'Password is required';
  else if (password.length < 6) e.password = 'At least 6 characters';
  if (password !== confirm) e.confirm = 'Passwords do not match';
  setErrors(e);
  return Object.keys(e).length === 0;
};
