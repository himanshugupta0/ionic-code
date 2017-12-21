import { Injectable } from "@angular/core";

@Injectable()

export class ValidationService {

    getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'invalidName': 'Invalid Name. Name should only be characters.',
            'invalidEmailAddress': 'Invalid email address.',
            'invalidPhone': 'Invalid Phone no. Contains only digits.',
            'invalidOthers': 'Contains only characters.',
            'invalidZip': 'Invalid Zip code. Contains only digits.',
            'minlength': `Minimum length ${validatorValue.requiredLength}`
        };

        return config[validatorName];
    }

    nameValidator(control) {
        if (control.value.match(/^[A-Za-z\s]+$/)) {
            return null;
        } else {
            return { 'invalidName': true };
        }
    }

    emailValidator(control) {
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    phoneValidator(control) {
        if (control.value.match(/^\d+$/)) {
            return null;
        } else {
            return { 'invalidPhone': true };
        }
    }

    othersValidator(control) {
        if (control.value.match(/^[a-zA-Z]*$/g)) {
            return null;
        } else {
            return { 'invalidOthers': true };
        }
    }

    zipValidator(control) {
        if (control.value.match(/^\d+$/)) {
            return null;
        } else {
            return { 'invalidZip': true };
        }
    }

}
