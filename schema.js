const Joi = require('joi');

module.exports.ListingSchema = Joi.object({
      listing : Joi.object( {
        title : Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.string().allow("",null),
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required(),
        category : Joi.string().required()
      }).required()
});


module.exports.ReviewSchema = Joi.object({
    review : Joi.object({
      comment : Joi.string().required(),
      rating :Joi.number().required().min(1).max(5)
    }).required()
})


module.exports.SignUpSchema = Joi.object({
  username : Joi.string().required().min(6),
  password : Joi.string()
  .min(8)
  .max(16)
  .pattern(/(?=(?:.*[a-z]){1,16}).+/, 'lowercase')
  .pattern(/(?=(?:.*[A-Z]){1,16}).+/, 'uppercase')
  .pattern(/(?=(?:.*[0-9]){1,16}).+/, 'number')
  .required()
  .error((errors) => {
    errors.forEach((err) => {
      switch (err.code) {
        case 'string.base':
        case 'string.empty':
        case 'any.required':
        default:
          err.message = defaultErrorMessage;
          break;
        case 'string.min':
          err.message = minLengthMessage;
          break;
        case 'string.max':
          err.message = maxLengthMessage;
          break;
        case 'string.pattern.name':
          switch (err.local.name) {
            case 'lowercase':
              err.message = 'must contain at least one lower-case letters';
              break;
            case 'uppercase':
              err.message = 'must contain at least one lower-case letters';
              break;
            case 'number':
              err.message = 'must contain at least one numbers';
              break;
            case 'special':
              err.message = 'must contain at least one special characters';
              break;
          }
          break;
      }
    });

    return errors;
  }),
  email : Joi.string().required().min(6)
})