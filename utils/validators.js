let emailValidator = (email) => {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const Validators = {
    emailValidator: emailValidator
};

module.exports = Validators;