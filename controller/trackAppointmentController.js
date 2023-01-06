const verification = require('../Models/Database_Queries/verification_query')
const patient = require('../Models/Database_Queries/patient_query')
const mail = require('nodemailer')
const insert = require('../Models/Database_Queries/insert_query')
const uuid = require('uuid')

let DoctorParams = [{
        firstName: "Squidward",
        lastName: "Tentacles",
        contact_number: "09984416526",
        room: 'ABC-205',
        gender: 'M',
        dateOfBirth: '2002-01-02',
        HMO_IDs: [1, 3, 6, 8],
        specialization_ID: 4
    },
    {
        firstName: "Spongebob",
        lastName: "Squarepants",
        contact_number: "09984416526",
        room: 'ABC-206',
        gender: 'M',
        dateOfBirth: '1994-01-02',
        HMO_IDs: [2, 4, 6, 1],
        specialization_ID: 1
    }, {
        firstName: "Eugene",
        lastName: "Crabs",
        contact_number: "09984416526",
        room: 'ABC-207',
        gender: 'M',
        dateOfBirth: '2000-01-02',
        HMO_IDs: [8, 2, 1, 4],
        specialization_ID: 7
    }, {
        firstName: "Sandy",
        lastName: "Cheeks",
        contact_number: "09653876383",
        room: 'ABC-210',
        gender: 'F',
        dateOfBirth: '1974-01-02',
        HMO_IDs: [7, 5, 3, 1],
        specialization_ID: 3
    }
]

const Department_List = [
    { department_Name: 'Department of Anesthesiology' },
    { department_Name: 'Department of Dental Medicine' },
    { department_Name: 'Department of Emergency Medicine' }
]


const HMO_List = [
    { HMO_Name: 'Flexicare' },
    { HMO_Name: 'Intellicare' },
    { HMO_Name: 'Kaiser International' },
    { HMO_Name: 'Healthgroup Inc.' },
    { HMO_Name: 'Lacson and Lacson Ins.' },
    { HMO_Name: 'Brokers Inc.' },
    { HMO_Name: 'Maxicare' },
    { HMO_Name: 'Med-Asia Phils.' },
    { HMO_Name: 'Amusement and Gaming Corporation' },
    { HMO_Name: 'Valuecare' },
    { HMO_Name: 'PhilCare' },
    { HMO_Name: 'Medocare' },
]

const Specialization_List = [
    { specialization_Name: 'Cardiology' },
    { specialization_Name: 'Psychiatrist' },
    { specialization_Name: 'Oncology' },
    { specialization_Name: 'Neurology' },
    { specialization_Name: 'Dermatology' },
    { specialization_Name: 'Internal Medicine' },
    { specialization_Name: 'Nephrology' },
    { specialization_Name: 'General Surgery' },

]

let ScheduleParams = {
    date: "2023-01-16",
    start_time: "07:00:00",
    end_time: "12:00:00",
    total_patient: 5
}

//Check appointment section
exports.renderUserDirectory = async(req, res) => {
    // insert.insertHmoList(HMO_List)
    // insert.insertSpecializationList(Specialization_List)
    // for (let i = 0; i < 4; i++) {
    //     insert.InsertDoctor(DoctorParams[i])
    // }
    //insert.InsertSchedule('MCM-43575aa9-60bc-4b62-8e5b-3722971fc331', ScheduleParams)
    const result = await patient.fetchUser_Directory()
    res.json(result)
}

exports.sendEmailOtp = async(req, res) => {
    const Patient = {
            Email: req.body.patient_Email
        }
        //To check if atleast 1 patient exists
    const result = await patient.fetchPatient_Appointments_Using_Email(Patient.Email)
    if (result.length !== 0) {
        const hashed = await verification.generateOTP(Patient.Email)
        sendEmail(Patient.Email, hashed)
    }
    res.end()
}

exports.fetchPatient_OTP = async(req, res) => {
    let user = {
        Email: req.body.inputEmail,
        user_ID: null,
        isVerified: false
    }
    console.log(req.body.inputEmail)
    const result = await verification.fetchPatient_OTP(user.Email)
    result.forEach(data => {

        if (data.user_OTP == req.body.inputOTP) {
            user.isVerified = true
            user.user_ID = data.user_ID
        }
    })
    if (user.isVerified)
        res.send({ isVerified: user.isVerified, user_ID: user.user_ID })
    else
        res.send({ isVerified: user.isVerified })
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
            from: '"templanzamark2002@gmail.com',
            to: email,
            subject: "Security Verification",
            html: "<b>" + otp + "</b>",
        });
        console.log("Message sent: %s", info.messageId);

    }

    main().catch(console.error);
}


exports.testInsertPatient = async(req, res) => {
    patientModel.insertPatient("Kevin Carbera", "Deep", "templanzamark2002@gmail.com", "9653876383", "111 Juan Luna St.", "20", "Male")
    patientModel.insertPatient("Joji", "SuckerVerg", "templanzamark2003@gmail.com", "9653876383", "111 Juan Luna St.", "25", "Male")
    res.send("success")
}