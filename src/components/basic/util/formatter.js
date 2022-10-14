import {  shortMonthName }  from './constants';

export const arrayFormatter = ( initialList) =>{
       
    var flatArray = [];
		var flatObject = {};

	    for (var index = 0; index < initialList.length; index++) {
            for (var key in initialList[index]) {
              var item = initialList[index][key];
              if (typeof(item) === "object") {
                //first level json
                var firstLevel = Object.keys(item);
                for (var i = 0; i < firstLevel.length; i++) {
                   var nested1Key =  key + '.' + firstLevel[i];
                   var nested1Item = Object.values(item)[i];
                   if(typeof(nested1Item) === 'object'){
                       //second level json
                      var secondLevel = Object.keys(nested1Item);
                      for (var j = 0; j < secondLevel.length; j++) {
                        var nested2Key =  nested1Key + '.' + secondLevel[j];
                        var nested2Item = Object.values(nested1Item)[j]; 
                        flatObject[nested2Key] = nested2Item;
                     }
                   }else{
                         flatObject[nested1Key] = nested1Item;
                  }
                }    
              }else{
                    flatObject[key] = item;
              }  
            }
            flatArray.push(flatObject);
        }  
    return flatArray;     
}

export const jsonFormatter = ( initialJSON ) =>{

  var flatObject = {};

         for (var key in initialJSON) {
            var item = initialJSON[key];
            if (typeof(item) === "object") {
              //first level json
              var firstLevel = Object.keys(item);
              for (var i = 0; i < firstLevel.length; i++) {
                 var nested1Key =  key + '.' + firstLevel[i];
                 var nested1Item = Object.values(item)[i];
                 if(typeof(nested1Item) === 'object'){
                     //second level json
                    var secondLevel = Object.keys(nested1Item);
                    for (var j = 0; j < secondLevel.length; j++) {
                      var nested2Key =  nested1Key + '.' + secondLevel[j];
                      var nested2Item = Object.values(nested1Item)[j]; 
                      flatObject[nested2Key] = nested2Item;
                   }
                 }else{
                       flatObject[nested1Key] = nested1Item;
                }
              }    
            }else{
                  flatObject[key] = item;
            }  
          }  
  return flatObject;     
}

export const dateFormatter = (dateValue) =>{

  var date = dateValue.slice((dateValue.indexOf(',') - 2) , (dateValue.indexOf(',')));
  if(date.includes(' '))
  {
     date = dateValue.slice((dateValue.indexOf(',') - 1) , (dateValue.indexOf(',')));
  }
  var monthNumber = '';
  if(date.length === 2) { monthNumber = shortMonthName[dateValue.slice(0 , (dateValue.indexOf(',') - 3))];}
  else if (date.length === 1){ monthNumber = shortMonthName[dateValue.slice(0 , (dateValue.indexOf(',') - 2))];}
  var year = dateValue.slice((dateValue.indexOf(',')+2) , dateValue.length);
  dateValue = year + '-' + monthNumber + '-' + date;
  
  return dateValue;

}

export const yearMonthFormatter = (dateValue) =>{
  var year = dateValue.getFullYear();
  var month = dateValue.getMonth() + 1 ;
  var date = dateValue.getDate();
  dateValue = year + '-' + month + '-' + date;
  return dateValue;
}

export const toInteger = (value) =>{
  if(value === '' || value === undefined){
      return 0;
  }else{
      return parseInt(value);
  }
}

export const currencyConverter = new Intl.NumberFormat('en-IN', { 
  style: 'currency', 
  currency: 'INR', 
  minimumFractionDigits: 2, 
});

export const currencyNumberOnly = new Intl.NumberFormat('en-IN', { 
  style: 'currency', 
  currency: 'INR', 
  currencyDisplay: 'symbol',
  minimumFractionDigits: 2, 
});


export const errorMessage = (message) => {
  if(message.localeCompare('Request failed with status code 401') === 0){
      return 'Unauthorized to access';
  }else if(message.localeCompare('Network Error') === 0){
      return 'Failed to Connect';
  }else{
      return '';
  }
};

export const invoiceValidation = (field) => {
if(field === 'branch'){
    return 'Choose Branch for Invoice';
}else if(field === 'customerInfo' ){
    return 'Select Bill To';
}else if(field === 'orderDate' ){
    return 'What would be order date for invoice ?';
}else if(field === 'requestedDate' ){
  return 'Please Fill Requested Date';
}else{
  return 'Choose atleast one product';
}
};

export const purchaseValidation = (field) => {
  if(field === 'branch' ){
    return 'Choose Branch for Invoice';
  }else if(field === 'supplierInfo'){
      return 'Select supplier by';
  }else if(field === 'poDate' ){
      return 'What would be Purchase Order date for purchase ?';
  }else if(field === 'requestedDate' ){
    return 'What would be Requested date for purchase ?';
  }else{
    return 'Choose atleast one product';
  }
};

export const expenseValidation = (field) => {
  if(field === 'vendor' ){
    return 'Select vendor To';
  }else if(field === 'items'){
      return 'Choose Select Heads for Expense then select atleast one expense type';
  }else if(field === 'paymentDate' ){
      return 'What would be Expnse date for expense ?';
  }else if(field === 'branch' ){
    return 'Choose Branch for Expense';
  }
  };