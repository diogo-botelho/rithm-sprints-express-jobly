const { BadRequestError } = require("../expressError");

  /** Convert 'dataToUpdate' object into data ready to include in Postgresql query.
   * 
   * Data can include: {name, description, numEmployees, logoUrl}
   * 
   * Returns { 'setCols', 'values' }.
   * 
   * 'setCols' - String with all the keys of 'dataToUpdate' (converted from
   *             camelCase to snakeCase), comma separated and each assigned to
   *             an incrementing idx.
   * 
   * 'values' - Array with values of 'dataToUpdate'.  
   *
   * 
   * Throws BadRequestError if no data to update is provided.
   */


function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(function(colName, idx){
    console.log("colName=",colName);
    console.log("this=",`"${colName}"=$${idx + 1}`);
      return `"${jsToSql[colName] || colName}"=$${idx + 1}`}
  );

  console.log("cols=",cols);
  // const cols = keys.map((colName, idx) =>
  //     `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  // );
  // console.log("dataToUpdate=",dataToUpdate);
  // console.log("jsToSql=",jsToSql);
  // console.log("cols=",cols);
  // console.log("keys=",keys);

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}


/** sqlForPartialSearch*/

function sqlForPartialSearch(dataToFilter) {
  // console.log("SqlForPartialSearch");
  // console.log("keys=",dataToFilter);
  const keys = Object.keys(dataToFilter);

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(function(colName,idx) {
    // console.log("colName=",colName);
    
    if (colName === "name"){
      // console.log(`${colName} ilike '%$${idx+1}%'`);
      return `lower("${colName}") LIKE lower(('%' || $${idx+1} || '%'))`;
    }
    else if (colName === "minEmployees") {
      // console.log(`${colName} >= $${idx+1}`);
      return `"num_employees" >= $${idx+1}`
    }
    else if (colName === "maxEmployees") {
      // console.log(`${colName} <= $${idx+1}`);
      return `"num_employees" <= $${idx+1}`
    }
    });
  
    // console.log("cols=",cols);
    const stringCols = cols.join(", ");
    
    // console.log("stringCols=",stringCols);
    // console.log("Object.values(dataToFilter)=",Object.values(dataToFilter))

  return {
    setCols: cols.join("AND "),
    values: Object.values(dataToFilter),
  };
}

module.exports = {
  sqlForPartialUpdate,
  sqlForPartialSearch
};
