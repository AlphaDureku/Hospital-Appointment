$(window).scroll(function() {
    $('nav').toggleClass('scrolled', $(this).scrollTop() > 350);
});

function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
$(document).ready(function() {
    $.get('http://localhost:3000/setup-HMO', function(data) {
        data.forEach(result => {
            $('#HMO_Query').append(`<option value="${result.HMO_ID}">${result.HMO_Name}</option>`)
        })
    })
    $.get('http://localhost:3000/setup-specialization', function(data) {
        data.forEach(result => {
            $('#specialization_Query').append(`<option value=${result.specialization_ID}>${result.specialization_Name}</option>`)
        })
    })
});





//Selected Service Page
$("#modal-btn").click(function() {
    if (isValidEmail($('#inputEmail').val())) {
        $.get("http://localhost:3000/user-directory", function(data, status) {
            let exist = false;
            data.forEach(result => {
                if ($('#inputEmail').val() == result.user_email) {
                    exist = true
                }
            })
            if (exist) {
                $.post("http://localhost:3000/send-OTP", {
                    patient_Email: $('#inputEmail').val()
                }, function(res, status) {
                    console.log(res)
                })
                $('#modal').modal('show');
            } else {
                $('#homeEmail').css({ 'display': 'block' })
                $('#homeEmail').html("No record associated with this email.")
                $('#error').modal('show');
            }
        });
    } else {
        $('#homeEmail').css({ 'display': 'block' })
        $('#homeEmail').html("Invalid email. Please enter a valid one.")
        $('#error').modal('show');
    }
});

const trackingCompareOTP = (inputOTP, inputEmail) => {
    $.post("http://localhost:3000/verify", {
        inputOTP: inputOTP,
        inputEmail: inputEmail
    }, function(res, status) {
        console.log(res.isVerified)
        if (res.isVerified) {
            $(location).attr('href', `http://localhost:3000/Manage-Appointments/${res.user_ID}`);
        } else {
            $('#otpError').css({ 'display': 'block' })
        }
    })
}

$("#sendOTP").click(function() {
    if ($("#inputEmail").val() != "" && isValidEmail($('#inputEmail').val())) {
        if ($('#checkbox').is(":checked")) {
            $.post("http://localhost:3000/book-appointment/send-OTP", {
                credentials: 'same-origin',
                patient_Email: $('#inputEmail').val()
            })
            $('#otpmodal').modal("show")
        } else {
            $('#termsAndServiceError').modal("show")
        }
    } else {

        $('#invalidEmailError').modal("show")
    }


})
const CompareOTPsetAppointment = (inputOTP) => {
    $.post("http://localhost:3000/book-appointment/verify-otp", {
        credentials: 'same-origin',
        inputOTP: inputOTP,
    }, function(res, status) {
        console.log(res.isVerified)
        if (res.isVerified) {
            $(location).attr('href', `http://localhost:3000/book-appointment/patient-forms`);
        } else {
            $('#otpError').css({ 'display': 'block' })
        }
    })
}
$("#cancel_modal").click(function() {
    $('#otpError').css({ 'display': 'none' })
    $('#otpInput').val('')
})

$("#modalBtn").click(function() {
    $("#terms").modal("show");
});

//Choose Schedule Page
$(document).ready(function() {
    $('input:checkbox').click(function() {
        $('input:checkbox').not(this).prop('checked', false);
    });
});

$(document).ready(function() {
    $('#book').click(function() {

        if ($('#drop-down').val() !== "") {
            $("#modal").modal("show");
            $.get("http://localhost:3000/book-appointment/get-receipt", {
                    doctor_schedule_ID: $('#drop-down').val()
                },
                function(data) {
                    $('#schedule_date').children().not(':first').remove();
                    $('#doctor_info').empty()
                    $('#schedule_date').append(`<p style="font-size: 17px; color: #848484;">${data.date}<br>${data.start} PM</p>`)
                    $('#doctor_info').append(` <p style="font-size: 17px; color: #848484;">Dr. ${data.doctor_first_name} ${data.doctor_last_name}<br>${data.doctor_specialization}</p>`)
                })
        } else {
            console.log('no sched')
        }
    });
});


$("#finish").click(function() {
    $.post("http://localhost:3000/book-appointment/set-appointment", {
        doctor_schedule_id: $('#drop-down').val()
    }, function(data, status) {

    })
});