export const required = (value: unknown, label: string) =>
  typeof value === "string" && value.trim()
    ? ""
    : `${label} is required`;

export const email = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? ""
    : "Enter valid email";

export const minLength = (value: string, min: number, label: string) =>
  value.trim().length >= min
    ? ""
    : `${label} must be at least ${min} characters`;

export const exactLength = (value: string, len: number, message: string) =>
  value.length === len ? "" : message;


export const validateContactForm = (data: any) => {
  const errors: any = {};

  const fname = required(data.fname, "First name");
  const lname = required(data.lname, "Last name");
  const emailErr =
    required(data.email, "Email") || email(data.email);

  const phoneErr =
    required(data.phone, "Phone") ||
    exactLength(data.phone, 10, "Phone must be 10 digits");

  const messageErr =
    required(data.message, "Message") ||
    minLength(data.message, 10, "Message");

  if (fname) errors.fname = fname;
  if (lname) errors.lname = lname;
  if (emailErr) errors.email = emailErr;
  if (phoneErr) errors.phone = phoneErr;
  if (messageErr) errors.message = messageErr;

  return errors;
};


export const validateModalForm = (data: any) => {
  const errors: any = {};

  const name = required(data.name, "Name");
  const emailErr = required(data.email, "Email") || email(data.email);

  const phoneErr =
    required(data.phone, "Phone") ||
    exactLength(data.phone, 10, "Phone must be 10 digits");

  const messageErr =
    required(data.message, "Message") ||
    minLength(data.message, 10, "Message");

  if (name) errors.name = name;
  if (emailErr) errors.email = emailErr;
  if (phoneErr) errors.phone = phoneErr;
  if (messageErr) errors.message = messageErr;

  return errors;
};
