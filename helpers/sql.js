"use strict";

const { BadRequestError } = require("../expressError");

/**
 *  --INPUT--
 *
 *  Takes 2 objects: dataToUpdate and jsToSql.
 *
 *  dataToUpdate contains a variable amount of keys about the information
 *  to alter in the database based on a PATCH request.
 *
 *  Example of dataToUpdate contents: {firstName : 'Aliya', age: 32}
 *
 *  jsToSql contains a variable amount of keys. For the possible columns in
 *  the database to update, the key is the camelCase version of the column name
 *  and the value is the snake_case version of the column name.
 *
 *  Single-worded variables are excluded because no conversion is needed.
 *
 *  Example of jsToSql contents:
 *
*   {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    }
 *
 *  --FUNCTION--
 *
 *  Grabs information from dataToUpdate to determine which columns to UPDATE
 *  in SQL query, along with the new values of those columns.
 *
 *  Column names in dataToUpdate are in camelCase, so it converts each name to
 *  its snake_case version.
 *
 *  Throws an error if dataToUpdate is empty.
 *
 *  --OUTPUT--
 *
 *  Returns an object with keys 'setCols' and 'values'.
 *
 *  'setCols' is a string of all the columns to update (written in snake_case),
 *  along with a `=$X` for SQL injection prevention.
 *
 *  'values' is an array with each of the values to update in the database.
 *
 *  Example: { setCols: "first_name=$1, age=$2", values: ['Aliya', 32] }
 */
// TODO: What if the user doesn't provide good jsToSql data? No validation
// for this
function sqlForPartialUpdate(dataToUpdate, jsToSql) {

  // Ensures there are at least some changes to make in the database
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // Iterates through dataToUpdate keys and creates an array for SQL input
  // sanitization.

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );


  // { setCols: "first_name=$1, age=$2", values: ['Aliya', 32] }
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
