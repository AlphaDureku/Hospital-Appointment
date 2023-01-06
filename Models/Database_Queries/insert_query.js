const model = require('../sequelize_sequelizeModel')
const uuid = require('uuid')
const Sequelize = require('sequelize')


async function saveQuery(table) {
    try {
        return await table.save()
    } catch (err) {
        console.log(err)
    }
}


exports.insert_user = async function() {
    const userModel = {
        user_ID: "USER-" + uuid.v4(),
        user_email: 'templanzamark2003@gmail.com',
        user_contact_number: "09984416526"
    }
    const newUser = await model.user.create(userModel)
}




exports.insertPatient = async function(patientParams) {
    const patientModel = model.patient.build({
        patient_ID: patientParams.ID,
        user_ID: patientParams.user_ID,
        patient_first_name: patientParams.firstName,
        patient_last_name: patientParams.lastName,
        patient_dateOfBirth: patientParams.dateOfBirth,
        patient_middle_name: patientParams.middleName,
        patient_address: patientParams.address,
        patient_gender: patientParams.gender
    })
    saveQuery(patientModel)
}



exports.InsertDoctor = async function(Doctor) {
    const doctorModel = {
        doctor_ID: "MCM-" + uuid.v4(),
        doctor_first_name: Doctor.firstName,
        doctor_last_name: Doctor.lastName,
        doctor_gender: Doctor.gender,
        doctor_contact_number: Doctor.contact_number,
        doctor_dateOfBirth: Doctor.dateOfBirth,
        doctor_room: Doctor.room,
        doctorSpecializationSpecializationID: Doctor.specialization_ID

    }
    const newDoctor = await model.doctor.create(doctorModel)
    for (const HMO_ID of Doctor.HMO_IDs) {
        const HMO = await model.HMO.findByPk(HMO_ID)
        await HMO.addDoctor(newDoctor)
    }
}
exports.insertHmoList = async function(HMO_list) {
    const inserted = await model.HMO.bulkCreate(HMO_list, { raw: true })
    console.log(inserted)
}
exports.insertDepartmentList = async function(Department_List) {
    const inserted = await model.department.bulkCreate(Department_List, { raw: true })
    console.log(inserted)
}

exports.insertSpecializationList = async function(specialization_List) {
    const inserted = await model.doctor_specialization.bulkCreate(specialization_List, { raw: true })
    console.log(inserted)
}


exports.InsertSchedule = async function(doctor_ID, params) {
    const schedule_tableModel = {
        doctor_schedule_ID: uuid.v4(),
        doctor_ID: doctor_ID,
        doctor_schedule_date: params.date,
        doctor_schedule_start_time: params.start_time,
        doctor_schedule_end_time: params.end_time,
        doctot_schedule_queueing_number: params.total_patient
    }
    const newSchedule = model.doctor_schedule_table.create(schedule_tableModel)

}

exports.insertAppointmentDetails = async function(patient_ID, doctor_ID, doctor_schedule_ID) {
    model.appointmentDetails.sync().then(() => {
        const appointmetDetailsModel = model.appointmentDetails.build({
            appointment_ID: "APPOINTMENT-" + uuid.v4(),
            patient_ID: patient_ID,
            doctor_schedule_ID: doctor_schedule_ID,
            doctor_ID: doctor_ID,
            appointment_type: "Clinic",
        })
        saveQuery(appointmetDetailsModel)
    })

}


exports.findOneDoctor = async function(pk) {
    return await model.doctor.findByPk(pk, { raw: true })

}
exports.findOneSchedule = async function(pk) {
    return await model.doctor_schedule_table.findByPk(pk, { raw: true })

}

exports.findOnePatient = async function(pk) {
    return await model.patient.findByPk(pk, { raw: true })

}