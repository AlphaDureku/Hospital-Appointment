const mail = require('nodemailer')
const doctor = require('../Models/Database_Queries/doctor_query')
const patient = require('../Models/Database_Queries/patient_query')
const Title = require('../Models/Object_Models/Title')
const uuid = require('uuid');




exports.renderClinicPage = async(req, res) => {
    req.session.patientModel.appointmentType = "Clinic"
    res.render('Services/clinic', { layout: 'layouts/sub', Title: Title.Clinic })
}
exports.renderOutpatientPage = async(req, res) => {
    req.session.patientModel.appointmentType = "Outpatient"
    res.render('Services/outpatient', { layout: 'layouts/sub', Title: Title.Outpatient })
}
exports.createPatientModel = function(req, res, next) {
    req.session.patientModel = {
        patientID: uuid.v4(),
        Fname: "",
        Mname: "",
        Lname: "",
        dateOfBirth: "",
        contactNumber: "",
        address: "",
        gender: "",
        appointmentType: "",
        doctor_schedule_ID: "",
    }
    next()
}


exports.sendOTP = async(req, res) => {
    sendEmail(req.session.Patient.Email, req.session.Patient.OTP)
    res.end()
}
exports.compareOTP = async(req, res) => {
    let Patient = {
        inputOTP: req.body.inputOTP,
        isVerified: false
    }
    if (Patient.inputOTP == /*req.session.Patient.OTP*/ 1) {
        Patient.isVerified = true
    }
    res.send({ isVerified: Patient.isVerified })
}
exports.generateOTP = function(req, res, next) {
    const hashed = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    req.session.Patient = {
        Email: req.body.patient_Email,
        OTP: hashed
    }
    next()
}
exports.renderPatientForm = async(req, res) => {
    res.render('Services/patient-forms', { layout: 'layouts/sub', Title: Title.PatientInformation })
}
exports.getPatientInfo = async(req, res) => {
    req.session.patientModel.Fname = req.body.Fname
    req.session.patientModel.Lname = req.body.Lname
    req.session.patientModel.Mname = req.body.Mname
    req.session.patientModel.address = req.body.address
    req.session.patientModel.contactNumber = req.body.contactNumber
    req.session.patientModel.dateOfBirth = req.body.dateOfBirth
    req.session.patientModel.gender = req.body.gender
    res.redirect('choose-doctor')
}
exports.renderDoctorList = async(req, res) => {
    const result = await doctor.getDoctor()
    const schedule = await doctor.getSchedule()
    res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, layout: 'layouts/sub', Title: Title.ChooseDoctor })
}
exports.searchDoctor = async(req, res) => {
    let searchOption = {
        Fname: req.query.doctor_Fname,
        Lname: req.query.doctor_Lname,
        Specialization: req.query.specialization,
        doctor_HMO: req.query.doctor_HMO
    }
    console.log(searchOption.Fname)
        //ALL
    if (!searchOption.Fname && !searchOption.Lname && !searchOption.Specialization && !searchOption.doctor_HMO) {
        const result = await doctor.getDoctor()
        const schedule = await doctor.getSchedule()
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
            //Using specs only
    } else if ((!searchOption.Fname && !searchOption.Lname) && (searchOption.Specialization != undefined && searchOption.doctor_HMO != undefined)) {
        console.log("get by spec and sub_spec only")
        const result = await doctor.getDoctor_Using_Spec_SubSpec_HMO(searchOption)
        const schedule = await doctor.getSchedule_Using_Spec_SubSpec_HMO(searchOption)
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
    } else if ((searchOption.Fname != undefined || searchOption.Lname != undefined) && (searchOption.Specialization || searchOption.doctor_HMO)) {
        console.log("get by Name, spec and sub_spec")
        const result = await doctor.getDoctor_Using_All(searchOption);
        const schedule = await doctor.getSchedule_Using_All(searchOption)
        console.log(result)
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
    } else if (searchOption.Fname && searchOption.Lname) {
        console.log("get by Fname Lname")
        const result = await doctor.getDoctor_Using_Fname_Lname(searchOption)
        const schedule = await doctor.getSchedule_Using_Fname_Lname(searchOption)
        console.log("get by Fname Lname")
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
    } else if (searchOption.Lname) {
        console.log("get by LName")
        const result = await doctor.getDoctor_Using_Lname(searchOption)
        const schedule = await doctor.getSchedule_Using_Lname(searchOption)
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
    } else if (searchOption.Fname) {
        console.log("get by FName")
        const result = await doctor.getDoctor_Using_Fname(searchOption)
        const schedule = await doctor.getSchedule_Using_Fname(searchOption)
        res.render('Services/choose-doctor', { queriedDoctors: result, queriedSchedule: schedule, retainDoctorQuery: searchOption, layout: 'layouts/sub', Title: Title.ChooseDoctor })
    } else {
        console.log("Undefined")
        res.render('Services/choose-doctor')
    }

}
exports.renderSchedule = async(req, res) => {
    const result = await doctor.getOneDoctor(req.session.doctor)

    res.send(result)
}
exports.renderSchedule2 = async(req, res) => {
    const result = await doctor.getOneDoctor2(req.session.doctor)
    console.log(result)
    res.send(result)
}
exports.chooseSchedule = async(req, res) => {
    req.session.doctor = req.query.doctor
    res.render('Services/choose-schedule', { layout: 'layouts/sub', Title: Title.chooseSchedule })
}

exports.getReceipt = async(req, res) => {

    //req.session.patientModel.doctor_schedule_ID = req.query.doctor_schedule_ID

    const result = await patient.getReceipt(req.query.doctor_schedule_ID)
    console.log(result)
    res.send(result[0])
}

exports.setAppointment = async(req, res) => {
        req.session.params = {
                Fname: req.session.patientModel.Fname,
                Lname: req.session.patientModel.Lname,
                Mname: req.session.patientModel.Mname,
                address: req.session.patientModel.address,
                contactNumber: req.session.patientModel.contactNumber,
                dateOfBirth: req.session.patientModel.dateOfBirth,
                gender: req.session.patientModel.gender,
                appointmentType: req.session.patientModel.appointmentType,
                doctorSchedule_ID: req.body.doctor_schedule_id
            }
            //Next step close the availability
        console.log(req.session.params)
        res.redirect('/')
    }
    // Send Email Process
const sendEmail = (email, otp) => {
    async function main() {
        let testAccount = await mail.createTestAccount();
        let transporter = mail.createTransport({
            service: 'gmail',
            secure: false,
            auth: {
                user: 'templanzamark2002@gmail.com',
                pass: 'iordclhizynxaekm',
            },
        });

        let info = await transporter.sendMail({
            from: '"templanzamark2002@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Security Verification", // Subject line
            html: "<b>" + otp + "</b>", // html body
        });
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    }

    main().catch(console.error);
}