export const checkRequiredFields = (requiredFields, objectJSON) => {
   let validatedFields = [];
   requiredFields.map((field) => {
      let elt = {};
      let object = objectJSON[field];
      if (object === '' || object === undefined) {
         elt.name = field;
         elt.className = 'is-invalid';
         validatedFields.push(elt);
      }
   })

   return validatedFields;
}

export const setRequiredFields = (formFields, validatedFields) => {
   formFields.map((field) => {
      validatedFields.map((validated) => {
         if (field.dataSource === validated.name) {
            if (validated.className === 'is-invalid') {
               field.valid = ' is-invalid';
            } else {
               field.valid = ' is-valid';
            }
         }
      })
   })
   return formFields;
}

export const validateForm = (formFields) => {
   let response = true;
   formFields.map((field) => {
      if (field.valid === ' is-invalid') {
         response = false;
      }
   })
   return response;
}

export const validateFields = (formFields, fieldName, fieldValue, fieldType) => {
   switch (fieldType) {

      case 'phoneNumber1':
         formFields.map((field) => {
            if (field.dataSource === fieldName) {
               if (fieldValue.length < 10) {
                  field.valid = ' is-invalid';
                  field.message = '';
               } else {
                  field.valid = ' is-valid';
                  field.message = '';
               }
            }
         })
         return formFields;

      case 'phoneNumber2':
         formFields.map((field) => {
            if (field.dataSource === fieldName) {
               if (fieldValue.length < 10) {
                  field.valid = ' is-invalid';
                  field.message = 'Enter 10 digit phone number';
               } else {
                  field.valid = ' is-valid';
                  field.message = '';
               }
            }
         })
         return formFields;

      case 'gstNumber':
         formFields.map((field) => {
            if (field.dataSource === fieldName) {
               let values = checkForGST(fieldValue);
               if(values === false){
                  field.valid = ' is-invalid';
                  field.message = 'Enter Valid GST Number';
               }else{
                  field.valid = ' is-valid';
                  field.message = '';
               }
            }
         })
         return formFields;

      // case 'contactPerson':
      //    formFields.map((field) =>{
      //       if(field.dataSource === fieldName){
      //          if(fieldValue.length === 0)
      //          {
      //             field.valid = ' is-invalid';
      //             field.message = 'This field is required ';
      //          }else{     
      //             field.valid = ' is-valid';
      //             field.message = 'This field is required ';

      //          }
      //       }
      //   })
      //   return formFields;

      // case 'city':
      //    formFields.map((field) =>{
      //       if(field.dataSource === fieldName){
      //          if(fieldValue.length === 0)
      //          {
      //             field.valid = ' is-invalid';
      //             field.message = 'This field is required ';
      //          }else{     
      //             field.valid = ' is-valid';
      //             field.message = 'This field is required ';
      //          }
      //       }
      //   })
      //   return formFields;

      //   case 'state':
      //    formFields.map((field) =>{
      //       if(field.dataSource === fieldName){
      //          if(fieldValue.length === 0)
      //          {
      //             field.valid = ' is-invalid';
      //             field.message = 'This field is required ';
      //          }else{     
      //             field.valid = ' is-valid';
      //             field.message = 'This field is required ';
      //          }
      //       }
      //   })
      //   return formFields;

      default:
         return formFields;
   }
}

export const checkForGST = (input) => {

   let regTest = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(input)
   if (regTest) {
     let a = 65, b = 55, c = 36;
     return Array['from'](input).reduce((i, j, k, g) => {
       let p;
       p = (p = (j.charCodeAt(0) < a ? parseInt(j) : j.charCodeAt(0) - b) * (k % 2 + 1)) > c ? 1 + (p - c) : p;
       return k < 14 ? i + p : j == ((c = (c - (i % c))) < 10 ? c : String.fromCharCode(c + b));
     }, 0);
   }
   return regTest;
}
