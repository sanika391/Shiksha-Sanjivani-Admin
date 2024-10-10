const SchoolModel = require("../Models/SchoolModel");
const schoolModel = require("../Models/SchoolModel");
const studentmodel = require("../Models/StudentModel");
const SchoolTypeModel = require("../Models/SchoolType");
const { default: mongoose } = require("mongoose");
const StudentModel = require("../Models/StudentModel");

async function getSchool(req, res) {
  try {
    let data = await schoolModel
      .find(req.query)
      .populate("Medium")
      .populate("State")
      .populate("District")
      .populate("Taluka")
      .populate("City");
    res.json({
      data: data,
      rcode: 200,
    });
  } catch (err) {
    res.json({
      err: err.msg,
      rcode: -9,
    });
  }
}

async function addSchool(req, res) {
  try {
    const lastSchool = await SchoolModel.findOne()
      .sort({ createdAt: -1 })
      .exec();
    const newSchool_id = lastSchool ? lastSchool.SchoolID + 1 : 100000;

    let data = new schoolModel(req.body);
    data.SchoolID = newSchool_id;
    await data.save();
    res.json({
      data: data,
      rcode: 200,
    });
  } catch (err) {
    console.log(err);
    res.json({
      err: err.msg,
      rcode: -9,
    });
  }
}

async function addSchoolType(req, res) {
  try {
    let data = new SchoolTypeModel(req.body);
    await data.save();
    res.json({
      data: data,
      rcode: 200,
    });
  } catch (err) {
    console.log(err);
    res.json({
      err: err.msg,
      rcode: -9,
    });
  }
}
async function getSchoolType(req, res) {
  try {
    let data = await SchoolTypeModel.find({});

    res.json({
      data: data,
      rcode: 200,
    });
  } catch (err) {
    res.json({
      err: err.msg,
      rcode: -9,
    });
  }
}

async function schoolDashboardCount(req, res) {
  try {
    const lastSchoolId = new mongoose.Types.ObjectId(req.query.School_ID);

    // The entire expression { $eq: [lastSchoolName, { $arrayElemAt: ["$School_name", -1] }] } compares the lastSchoolName variable with the last element of the School_name array within each document.

    const students = await studentmodel.find({
      $expr: {
        $eq: [
          lastSchoolId,
          { $arrayElemAt: ["$SchoolID", -1] }, // Get the last element of the School_name array
        ],
      },
    });

    const malestudents = students.filter((ele) => {
      return ele.Gender == "male";
    });
    const femalestudents = students.filter((ele) => {
      return ele.Gender == "female";
    });
    const otherstudents = students.filter((ele) => {
      return ele.Gender == "other";
    });
    const inactivestudents = await StudentModel.find({ is_active: 0 });
    const dropwithreason = await StudentModel.find({ is_active: 1 });
    const dropwithoutreason = await StudentModel.find({ is_active: 2 });
    const activestudents = students.filter((ele) => {
      return ele.is_active == 3;
    });
    console.log(
      dropwithreason.length,
      dropwithoutreason.length,
      inactivestudents.length
    );
    res.json({
      students: students.length,
      malestudents: malestudents.length,
      femalestudents: femalestudents.length,
      otherstudents: otherstudents.length,
      inactivestudents: inactivestudents.length,
      dropwithreason: dropwithreason.length,
      dropwithoutreason: dropwithoutreason.length,
      activestudents: activestudents.length,
      rcode: 200,
    });
  } catch (error) {
    console.log(err);
    res.json({
      data: err,
      rcode: -9,
    });
  }
}

async function addExistingStudent(req, res) {
  const studentId = req.query.studentId;
  const standard = req.query.standard;
  const schoolID = req.query.schoolID;

  try {
    if (studentId && schoolID) {
      let student = await studentmodel.findOne({ _id: studentId });
      student.Standard = standard;
      student.SchoolID.push(schoolID);
      await student.save();
      console.log("Student Updated");
      res.json({
        data: student,
        rcode: 200,
      });
    } else {
      res.json({
        data: "No User Found",
        rcode: 200,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      err: err.msg,
      rcode: -9,
    });
  }
}

module.exports = {
  addSchool,
  getSchool,
  addSchoolType,
  getSchoolType,
  schoolDashboardCount,
  addExistingStudent,
};
