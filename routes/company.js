const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");

const Company = require("../models/Company");
const { body, validationResult } = require("express-validator");
const { upload } = require("../helpers/filehelper");

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};

// ROUTE 1: Get All the companys using: GET "/api/companys/getuser". Login required
router.get("/fetchallcompany", async (req, res) => {
  try {
    let statusDescription = {};
    const company = await Company.find({});
    statusDescription = {
      statusCode: 200,
      statusMessage: "Success !!",
    };
    res.json({ statusDescription, company });
    // res.json(company);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchcompany", fetchuser, async (req, res) => {
  try {
    let statusDescription = {};

    const company = await Company.findOne({ user: req.user.id });
    // console.log(company);
    if (company.length == 0 || company == null) {
      statusDescription = {
        statusCode: 222,
        statusMessage: "No Company Found",
      };
      return res.json({ statusDescription });
    }
    statusDescription = {
      statusCode: 200,
      statusMessage: "Success !!",
    };
    res.status(200).json({ statusDescription, company });
    // res.json(company);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/fetchcompany/:id", async (req, res) => {
  try {
    let statusDescription = {};

    const company = await Company.findById(req.params.id);
    // console.log(company);
    if (company == null) {
      statusDescription = {
        statusCode: 222,
        statusMessage: "No Company Found",
      };
      return res.json({ statusDescription });
    }
    statusDescription = {
      statusCode: 200,
      statusMessage: "Success !!",
    };
    res.status(200).json({ statusDescription, company });
    // res.json(company);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new company using: POST "/api/companys/addcompany". Login required

// router.post(
//   "/addcompany",
//   // fetchuser

//   [
//     body("nature", "Enter a valid company nature").isLength({ min: 5 }),
//     body("additional", "Enter a valid company additional").isLength({ min: 5 }),
//     body("ceo", "Enter a valid company ceo").isLength({ min: 5 }),
//     body("aboutUs", "Enter a valid company about").isLength({ min: 25 }),
//     body("companyName", "Enter a valid company name").isLength({ min: 3 }),
//     body("firstName", "Enter a valid firstName").isLength({ min: 3 }),
//     body("lastName", "Enter a valid lastName").isLength({ min: 3 }),
//     body("Address", "Enter a valid Address").isLength({ min: 5 }),
//     body("city", "Enter a valid city").isLength({ min: 3 }),
//     body("state", "Enter a valid state").isLength({ min: 3 }),
//     body("pincode", "Enter a valid pincode").isLength({ min: 3 }),
//     body("gstNumber", "Enter a valid gstNumber").isLength({ min: 3 }),
//     body("crn", "Enter a valid company registration number").isLength({
//       min: 3,
//     }),
//     body("noEmployes", "Enter a valid noEmployes").isLength({ min: 2 }),
//     body("yearEstablishment", "Enter a valid yearEstablishment").isLength({
//       min: 3,
//     }),
//   ],
//   async (req, res) => {
//     let success = false;

//     try {
//       const {
//         nature,
//         additional,
//         ceo,
//         aboutUs,
//         companyName,
//         firstName,
//         lastName,
//         Address,
//         city,
//         state,
//         pincode,
//         gstNumber,
//         crn,
//         noEmployes,
//         yearEstablishment,
//         legalStatus,
//         files,
//         filePath,
//         fileType,fileSize
//       } = req.body;

//       // If there are errors, return Bad request and the errors
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       let findcompany = await Company.findOne({
//         companyName: req.body.companyName,
//       });
//       if (findcompany) {
//         return res.status(400).json({
//           success,
//           error: "Sorry a company with this name already exists",
//         });
//       }
//       const company = new Company({
//         nature,
//         additional,
//         ceo,
//         aboutUs,
//         companyName,
//         firstName,
//         lastName,
//         Address,
//         city,
//         state,
//         pincode,
//         gstNumber,
//         crn,
//         noEmployes,
//         yearEstablishment,
//         legalStatus,
//         // user: req.user.id,
//       });
//       const savedCompany = await company.save();

//       success = true;
//       res.json({ success, savedCompany });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

router.post(
  "/addcompany",
  fetchuser,
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
    {
      name: "files",
      maxCount: 10,
    },
  ]),
  // upload.single("file"),
  [
    body("nature", "Enter a valid company nature").isLength({ min: 5 }),
    body("additional", "Enter a valid company additional").isLength({ min: 5 }),
    body("ceo", "Enter a valid company ceo").isLength({ min: 5 }),
    body("aboutUs", "Enter a valid company about").isLength({ min: 25 }),
    body("companyName", "Enter a valid company name").isLength({ min: 3 }),
    body("firstName", "Enter a valid firstName").isLength({ min: 3 }),
    body("lastName", "Enter a valid lastName").isLength({ min: 3 }),
    body("Address", "Enter a valid Address").isLength({ min: 5 }),
    body("city", "Enter a valid city").isLength({ min: 3 }),
    body("state", "Enter a valid state").isLength({ min: 3 }),
    body("pincode", "Enter a valid pincode").isLength({ min: 3 }),
    body("gstNumber", "Enter a valid gstNumber").isLength({ min: 3 }),
    body("crn", "Enter a valid company registration number").isLength({
      min: 3,
    }),
    body("noEmployes", "Enter a valid noEmployes").isLength({ min: 2 }),
    body("yearEstablishment", "Enter a valid yearEstablishment").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    let success = false;
    let statusDescription = {};
    const err = [];
    try {
      const {
        nature,
        additional,
        ceo,
        aboutUs,
        companyName,
        firstName,
        lastName,
        Address,
        city,
        state,
        pincode,
        gstNumber,
        crn,
        noEmployes,
        yearEstablishment,
        legalStatus,
      } = req.body;
      console.log(
        "file",
        req.files.file == undefined,
        req.files.files == undefined
      );
      if (
        // !req.files.file ||
        // !req.files.file[0].originalname ||
        // !req.files ||
        req.files.file == undefined ||
        req.files.files == undefined
        // (req.files.file != undefined && req.files.files != undefined)
        // !req.files.files
        // !req.files.file[0].mimetype
      ) {
        let statusDescription = {
          statusCode: 400,
          statusMessage: "Request Body Not Completed",
        };
        return res.status(400).json({
          statusDescription,
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((element) => {
          err.push(element.msg);
        });
        let statusDescription = {
          statusCode: 400,
          statusMessage: err,
        };
        return res.status(400).json({
          statusDescription,
        });
      }
      // console.log("File", req.files.file[0].originalname);
      // console.log("Files", req.files.files);

      let filesArray = [];
      req.files.files.forEach((element) => {
        // console.log("hello", element);
        const file = {
          // fileName: element.originalname,
          filePath: element.path,
          // fileType: element.mimetype,
          // fileSize: fileSizeFormatter(req.file.size, 2),
          // fileSize: fileSizeFormatter(element.size, 2),
        };
        filesArray.push(file);
      });

      const file = {
        // fileName: req.files.file[0].originalname,
        filePath: req.files.file[0].path,
        // fileType: req.files.file[0].mimetype,
        // fileSize: fileSizeFormatter(req.files.file[0].size, 2),
      };

      // If there are errors, return Bad request and the errors

      // if (!file.filePath || !file.fileType || !file.fileName) {
      //   let statusDescription = {
      //     statusCode: 400,
      //     statusMessage: "Request Body Not Completed",
      //   };
      //   return res.status(400).json({
      //     statusDescription,
      //   });
      // }

      // let filesArray = [];

      // req.files.files.forEach((element) => {
      //   console.log(element);
      //   const file = {
      //     fileName: element.originalname,
      //     filePath: element.path,
      //     fileType: element.mimetype,
      //     fileSize: fileSizeFormatter(req.file.size, 2),
      //   };
      //   filesArray.push(file);
      // });

      // req.files.files.forEach((element) => {
      //   console.log("E", element);
      //   const file = {
      //     fileName: element.originalname,
      //     filePath: element.path,
      //     fileType: element.mimetype,
      //     fileSize: fileSizeFormatter(req.file.size, 2),
      //   };
      //   filesArray.push(file);
      // });

      let findcompany = await Company.findOne({
        companyName: req.body.companyName,
      });
      if (findcompany) {
        let statusDescription = {
          statusCode: 222,
          statusMessage: "Sorry a company with this name already exists",
        };
        return res.status(200).json({
          statusDescription,
        });
      }
      const company = new Company({
        user: req.user.id,
        nature,
        additional,
        ceo,
        aboutUs,
        companyName,
        firstName,
        lastName,
        Address,
        city,
        state,
        pincode,
        gstNumber,
        crn,
        noEmployes,
        yearEstablishment,
        legalStatus,
        // fileSize: file.fileName,
        filePath: file.filePath,
        // fileType: file.fileType,
        files: filesArray,

        // user: req.user.id,
      });
      const savedCompany = await company.save();

      let statusDescription = {
        statusCode: 200,
        statusMessage: "Company Created Successfully",
      };
      return res.status(200).json({
        statusDescription,
        savedCompany,
      });
    } catch (error) {
      console.error(error.message, error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing company using: PUT "/api/companys/updatecompany". Login required
router.post("/updatecompany/:id", fetchuser, async (req, res) => {
  const {
    nature,
    additional,
    ceo,
    aboutUs,
    companyName,
    firstName,
    lastName,
    Address,
    city,
    state,
    pincode,
    gstNumber,
    crn,
    noEmployes,
    yearEstablishment,
    legalStatus,
  } = req.body;

  try {
    // Create a newcompany object

    const newCompay = {};

    let statusDescription = {};

    if (req.params.id.length != 24) {
      statusDescription = {
        statusCode: 400,
        statusMessage: "Send Proper Object Id",
      };
      return res.status(400).send(statusDescription);
    }

    if (
      !nature ||
      !additional ||
      !ceo ||
      !aboutUs ||
      !companyName ||
      !firstName ||
      !lastName ||
      !Address ||
      !city ||
      !state ||
      !pincode ||
      !gstNumber ||
      !crn ||
      !noEmployes ||
      !yearEstablishment ||
      !legalStatus
    ) {
      statusDescription = {
        statusCode: 400,
        statusMessage: "Request Body Not Completed",
      };
      return res.status(400).send(statusDescription);
    }

    if (nature) {
      newCompay.nature = nature;
    }
    if (additional) {
      newCompay.additional = additional;
    }
    if (ceo) {
      newCompay.ceo = ceo;
    }
    if (aboutUs) {
      newCompay.aboutUs = aboutUs;
    }
    if (companyName) {
      newCompay.companyName = companyName;
    }
    if (firstName) {
      newCompay.firstName = firstName;
    }
    if (lastName) {
      newCompay.lastName = lastName;
    }
    if (Address) {
      newCompay.Address = Address;
    }
    if (city) {
      newCompay.city = city;
    }
    if (state) {
      newCompay.state = state;
    }
    if (pincode) {
      newCompay.pincode = pincode;
    }
    if (gstNumber) {
      newCompay.gstNumber = gstNumber;
    }
    if (crn) {
      newCompay.crn = crn;
    }
    if (noEmployes) {
      newCompay.noEmployes = noEmployes;
    }
    if (yearEstablishment) {
      newCompay.yearEstablishment = yearEstablishment;
    }
    if (legalStatus) {
      newCompay.legalStatus = legalStatus;
    }

    // Find the company to be updated and update it
    let company = await Company.findById({ _id: req.params.id });
    let company1 = await Company.findOne({
      companyName: req.body.companyName,
    });
    // console.log(company.companyName);
    if (!company) {
      statusDescription = {
        statusCode: 200,
        statusMessage: "Company Not Found",
      };
      return res.status(200).send({ statusDescription });
      return res.status(404).send("Not Found");
    }

    // console.log(
    //   company.companyName,
    //   req.body.companyName,
    //   company.companyName != req.body.companyName
    // );

    if (company1 && company.companyName != req.body.companyName) {
      statusDescription = {
        statusCode: 401,
        statusMessage: "A Company With This Name Already Exist",
      };
      return res.status(200).send({ statusDescription });
    }

    // if (company.user.toString() !== req.user.id) {
    //   return res.status(401).send("Not Allowed");
    // }
    company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: newCompay },
      { new: true }
    );
    statusDescription = {
      statusCode: 200,
      statusMessage: "Company Updated Successfully",
    };
    res.json({ statusDescription, company });
  } catch (error) {
    console.error(error.message, error);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Delete an existing company using: DELETE "/api/companys/deletecompany". Login required
router.delete("/deletecompany/:id", fetchuser, async (req, res) => {
  try {
    // Find the company to be delete and delete it
    let company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).send("Not Found");
    }

    // Allow deletion only if user owns this Company
    if (company.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    company = await Company.findByIdAndDelete(req.params.id);
    res.json({ Success: "Company has been deleted", company: company });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
