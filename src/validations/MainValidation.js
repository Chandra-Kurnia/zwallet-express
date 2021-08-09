import { body } from "express-validator";

const rulesFileUploud = (req, res, next) => {
  if (req.files) {
    if (req.files.image_topup) {
      delete req.files.image_topup.data;
      req.body.image_topup = { ...req.files.image_topup };
    }
  }
  next();
};

const rulesCreateImgTopUp = () => [
  body("image_topup")
    .notEmpty()
    .withMessage("Please attach a picture of your proof of transfer")
    .bail()
    .custom((value) => {
      if (value.mimetype !== "image/png" && value.mimetype !== "image/jpeg") {
        throw new Error("image must be jpg or png");
      }
      return true;
    })
    .bail()
    .custom((value) => {
      if (parseInt(value.size, 10) > 5242880) {
        throw new Error("image size exceeds 2 megabytes");
      }
      return true;
    }),
];

const topUpFieldRules = () => [
  body("amount")
    .notEmpty()
    .withMessage("Please enter the nominal money")
    .bail()
    .isNumeric()
    .withMessage("nominal must be a number"),
  body("description")
    .notEmpty()
    .withMessage("You have to explain your top up")
    .bail()
    .isLength({ min: 10 })
    .withMessage("Please, explain at least with 10 characters"),
];

export { topUpFieldRules, rulesFileUploud, rulesCreateImgTopUp };
