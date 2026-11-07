/**
 * @typedef {Object} FormFields
 * @property {HTMLInputElement} nombre
 * @property {HTMLInputElement} correo
 * @property {HTMLTextAreaElement} mensaje
 */

const form = document.getElementById('contact-form');

if (form) {
  /**
   * @type {FormFields}
   */
  const fields = {
    nombre: document.getElementById('nombre'),
    correo: document.getElementById('correo'),
    mensaje: document.getElementById('mensaje')
  };

  /**
   * Shows or clears the inline error message for a field.
   *
   * @param {keyof FormFields} fieldName - The field to update.
   * @param {string} message - Error message to display, or an empty string to clear it.
   */
  const setFieldError = (fieldName, message) => {
    const input = fields[fieldName];
    const errorText = input.parentElement.querySelector('.field-error');

    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    errorText.textContent = message;
  };

  /**
   * Validates that the provided email matches a basic email-format pattern.
   *
   * @param {string} email - Email address entered by the user.
   * @returns {boolean} True if the email format is valid.
   */
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  /**
   * Validates all required fields in the contact form.
   *
   * @returns {boolean} True when all fields pass validation.
   */
  const validateForm = () => {
    let isValid = true;

    if (!fields.nombre.value.trim()) {
      setFieldError('nombre', 'El nombre es obligatorio.');
      isValid = false;
    } else {
      setFieldError('nombre', '');
    }

    if (!fields.correo.value.trim()) {
      setFieldError('correo', 'El correo es obligatorio.');
      isValid = false;
    } else if (!validateEmail(fields.correo.value)) {
      setFieldError('correo', 'Ingresa un correo válido.');
      isValid = false;
    } else {
      setFieldError('correo', '');
    }

    if (!fields.mensaje.value.trim()) {
      setFieldError('mensaje', 'El mensaje es obligatorio.');
      isValid = false;
    } else {
      setFieldError('mensaje', '');
    }

    return isValid;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    form.reset();
    Object.keys(fields).forEach((fieldName) => setFieldError(fieldName, ''));
  });
}
