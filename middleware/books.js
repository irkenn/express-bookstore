const ExpressError = require("../expressError");
const jsonschema = require("jsonschema");
const bookSchema = require('../schema/bookSchema.json');

function validateSchema(req, res, next){
    const result = jsonschema.validate(req.body, bookSchema);
    if(!result.valid){
        const listOfErrors = result.errors.map(e => e.stack);
        const err = new ExpressError(listOfErrors, 400);
        return next(err);
    }
    return next();
}



module.exports = { validateSchema };