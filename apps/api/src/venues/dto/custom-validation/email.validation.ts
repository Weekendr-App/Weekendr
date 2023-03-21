import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

class IsPhoneNumberRule implements ValidatorConstraintInterface {
  validate(value: any): boolean | Promise<boolean> {
    return PHONE_REGEX.test(value);
  }

  defaultMessage(): string {
    return 'value is not a valid phone number';
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPhoneNumberRule,
    });
  };
}
