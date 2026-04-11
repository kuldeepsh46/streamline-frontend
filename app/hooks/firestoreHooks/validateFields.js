const validateFields = ({data, isGuardian}) => {

  function isExclusivelyNumber(input) {
    return /^\d+$/.test(input) && !isNaN(Number(input)) && isFinite(Number(input));
  }  

  for (const [key, value] of Object.entries(data)) {
    console.log("PRICE CHECK",key,value)

     if(key=="price"){
      if (!isExclusivelyNumber(value)||value==""){
        throw new Error(`Hi ,Invalid value for field "${key}" with value "${JSON.stringify(value)}": Gotta be a numba!`)  
      }
     }else
    if((key==="programTypes") || (key==="skillLevels")){
      try{
      for (const level in value)
      {
        validateFields({data:value[level]})
      }
    }
      catch(error){
        throw new Error(`Hi ,Invalid value for field "${key}" with value "${JSON.stringify(value)}": Cannot be null, undefined, an empty string, or an empty array`)
      }
    } else if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      if ((isGuardian && key === "dateOfBirth") || (key === "longitude") || (key === "latitude")) {
        // Skip validation for dateOfBirth if isGuardian is true
      }
      else {
        console.log(key,value)
        throw new Error(`Invalid value for field "${key}" with value "${JSON.stringify(value)}": Cannot be null, undefined, an empty string, or an empty array`);
      }
    }
  }
};

export default validateFields;