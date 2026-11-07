const fieldNames = ['nombre', 'correo', 'mensaje'] as const;
type FieldName = (typeof fieldNames)[number];

type ContactField = {
  input: HTMLInputElement | HTMLTextAreaElement;
  error: HTMLElement;
};

/**
 * Finds a required element and verifies it has the expected DOM type.
 *
 * @param parent - The document or element to search within.
 * @param selector - Selector for the element.
 * @param elementType - Expected element constructor.
 * @returns The matching element.
 */
function getRequiredElement<T extends HTMLElement>(
  parent: ParentNode,
  selector: string,
  elementType: { new (): T }
): T {
  const element = parent.querySelector(selector);

  if (!(element instanceof elementType)) {
    throw new Error(`Expected ${selector} to exist and be a valid element.`);
  }

  return element;
}

/**
 * Resolves a field and its inline error element from the form markup.
 *
 * @param selector - Selector for the input or textarea.
 * @param elementType - Expected field element constructor.
 * @returns The field input and its error-message element.
 */
function getContactField<T extends HTMLInputElement | HTMLTextAreaElement>(
  selector: string,
  elementType: { new (): T }
): ContactField {
  const input = getRequiredElement(form, selector, elementType);
  const fieldGroup = input.parentElement;

  if (!fieldGroup) {
    throw new Error(`Expected ${selector} to have a field group.`);
  }

  return {
    input,
    error: getRequiredElement(fieldGroup, '.field-error', HTMLElement)
  };
}

const form = getRequiredElement(document, '#contact-form', HTMLFormElement);
const fields: Record<FieldName, ContactField> = {
  nombre: getContactField('#nombre', HTMLInputElement),
  correo: getContactField('#correo', HTMLInputElement),
  mensaje: getContactField('#mensaje', HTMLTextAreaElement)
};

/**
 * Shows or clears the inline error message for a field.
 *
 * @param fieldName - The field to update.
 * @param message - Error message to display, or an empty string to clear it.
 */
function setFieldError(fieldName: FieldName, message: string): void {
  const { input, error } = fields[fieldName];
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message;
}

/**
 * Checks whether an email address matches the expected email format.
 *
 * @param email - Email address entered by the user.
 * @returns True if the email format is valid.
 */
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates all required fields in the contact form and displays field errors.
 *
 * @returns True when all fields pass validation.
 */
function validateForm(): boolean {
  let isValid = true;

  if (!fields.nombre.input.value.trim()) {
    setFieldError('nombre', 'El nombre es obligatorio.');
    isValid = false;
  } else {
    setFieldError('nombre', '');
  }

  if (!fields.correo.input.value.trim()) {
    setFieldError('correo', 'El correo es obligatorio.');
    isValid = false;
  } else if (!validateEmail(fields.correo.input.value)) {
    setFieldError('correo', 'Ingresa un correo válido.');
    isValid = false;
  } else {
    setFieldError('correo', '');
  }

  if (!fields.mensaje.input.value.trim()) {
    setFieldError('mensaje', 'El mensaje es obligatorio.');
    isValid = false;
  } else {
    setFieldError('mensaje', '');
  }

  return isValid;
}

form.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  form.reset();
  fieldNames.forEach((fieldName) =>
    setFieldError(fieldName, '')
  );
});
