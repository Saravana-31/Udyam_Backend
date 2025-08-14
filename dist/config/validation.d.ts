import Joi from "joi";
export declare const formValidationSchema: Joi.ObjectSchema<any>;
export declare const validateFormData: (data: any) => {
    isValid: boolean;
    errors: Record<string, string>;
    data: null;
} | {
    isValid: boolean;
    errors: null;
    data: any;
};
//# sourceMappingURL=validation.d.ts.map