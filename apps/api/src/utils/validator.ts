import {
  validate,
  ValidationError as ClassValidatorValidationError,
  ValidatorOptions,
} from "class-validator";
import { HttpError } from "../contracts/errors/http.error";
import { validationTypes } from "../middlewares/validation.middleware";

const validator = async (
  object: object,
  type: validationTypes,
  options?: ValidatorOptions
) => {
  const validationErrors: ClassValidatorValidationError[] = await validate(
    object,
    options
  );

  if (validationErrors.length > 0) {
    const errors = mapValidationErrors(validationErrors);
    throw new HttpError(400, `Error while validating ${type}`, errors);
  }
};

const mapValidationErrors = (errors: ClassValidatorValidationError[]) => {
  return errors.reduce(
    (m: { [key: string]: object }, error: ClassValidatorValidationError) => {
      m[error.property] = error.constraints
        ? Object.values(error.constraints)
        : mapValidationErrors(error.children);
      return m;
    },
    {}
  );
};

export default validator;
