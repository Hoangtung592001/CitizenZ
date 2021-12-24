function getObj(name) {
    return document.querySelector(name);
}

function changeDisplayToNone(name) {
    getObj(name).style.display = 'none';
}

function changeDisplayToBlock(name) {
    getObj(name).style.display = 'block';
}

function showDropDown() {
    if (getObj('.userDropDownMenu').style.display == '' || getObj('.userDropDownMenu').style.display == 'none') {
        changeDisplayToBlock('.userDropDownMenu');
        changeDisplayToBlock('.cover');
        getObj('.nav-bar').style.zIndex = '2';
        getObj('.userButton').style.backgroundColor = '#00BFFF';
        hideAll('.manageDropDownMenu');
    } else {
        changeDisplayToNone('.userDropDownMenu');
        changeDisplayToNone('.cover');
        getObj('.userButton').style.backgroundColor = '#81DAF5'
    }
}

function closeDropDown() {
    getObj('.userButton').style.backgroundColor = '#81DAF5';
    changeDisplayToNone('.userDropDownMenu');
    changeDisplayToNone('.cover');
    changeDisplayToNone('.userDropDownMenuTablet');
    hideAll('.manageDropDownMenu');
    getObj('.userButtonTablet').style.backgroundColor = '#81DAF5';
}

function showDropDownTablet(tis) {
    $('.userDropDownMenuTablet').slideToggle('200');
    console.log( $('.userDropDownMenuTablet').css('display'));

}

$('.manageButtonTablet').click(function() {
    $('.manageDropDownMenuTablet').slideToggle('200');
});

function toggleMenuTablet() {
   $('.tablet-menu').slideToggle("200");
}

$(".manageButton").click(function() {
    $('.manageDropDownMenu').toggle();
    var dpl = $('.manageDropDownMenu').css('display');
    if (dpl == 'none') {
        $('.manageButton').css('background-color','#81DAF5');
    } else {
        $('.manageButton').css('background-color','#00BFFF');
        hideAll('.userDropDownMenu');
        $('.cover').show();
    }
});

function hideAll(name) {
    var parent = name.slice(0,name.length - 12);
    $(name).hide();
    $(parent + 'Button').css('background-color','#81DAF5');
}

function hideAndShow(modal, showButton, hideButton) {
    $(showButton).click(function() {
        $(modal).show();
    })
    $(hideButton).click(function() {
        $(modal).hide();
    })
}

hideAndShow('.update-modal','.updateInfoMain','.cancelUpdate');

hideAndShow('.register-modal','.giveAccount','.cancelRegister');

hideAndShow('.giveId-modal','.giveId', '.cancelGiveId');

hideAndShow('.givePMS-modal', '.givePMS', '.cancelGivePMS');

hideAndShow('.ppSentByB2-modal', '.listPPSentByB2', '.closeListPPSentByB2');

hideAndShow('.warning-modal', '.completeButton','.cancelButton');

function addIdToSelectId() {
    for (var i = 1; i <= 63; i++) {
        var id = i.toString();
        if (id.length == 1) {
            id = '0' + id;
        }
        var ans = document.createElement('option');
        ans.value = id;
        ans.innerHTML = id;
        $('.lowLevelID').append(ans);
    }
}

addIdToSelectId();

function addInfo(stt, name, status, population, href) {
    var sttDiv = $("<div></div>").text(stt);
    var nameDiv = $("<a></a>").text(name);
    var statusDiv = $("<div></div>").text(status);
    var ppltDiv = $("<div></div>").text(population);
    sttDiv.addClass("c-1 bor-right-2 stt");
    nameDiv.addClass("c-2 bor-right-2 mainLowLevelName");
    statusDiv.addClass("c-3 bor-right-2 status");
    ppltDiv.addClass("c-4 population");
    var main = $("<a></a>");
    main.attr("href", href);
    main.addClass("dis-flex main");
    main.append(sttDiv, nameDiv, statusDiv, ppltDiv);
    if (stt % 2 == 0) {
        main.addClass('odd-line');
    }

    $('.main-web').append(main);
}

function addInfoCitizen(stt, name, gender, dob, job, villageId, href) {
    var sttDiv = $("<div></div>").text(stt);
    var nameDiv = $("<div></div>").text(name);
    var genderDiv = $("<div></div>").text(gender);
    var dobDiv = $("<div></div>").text(dob);
    var jobDiv = $("<div></div>").text(job);
    var villageIdDiv = $("<div></div>").text(villageId);
    var main = $("<a></a>");
    main.attr("href", href);
    main.addClass("dis-flex main");
    sttDiv.addClass("c-1-info bor-right-2 stt");
    nameDiv.addClass("c-2-info bor-right-2 name");
    genderDiv.addClass("c-3-info bor-right-2 gender");
    dobDiv.addClass("c-4-info bor-right-2 dob");
    jobDiv.addClass("c-5-info bor-right-2 job");
    villageIdDiv.addClass("c-6-info village-id");
    if (stt % 2 == 0) {
        main.addClass('odd-line');
    }
    main.append(sttDiv, nameDiv, genderDiv, dobDiv, jobDiv, villageIdDiv);
    $('.main-web-info').append(main);
}

$('.submit-id-button').click((e) => {
    e.preventDefault();
    // data cho fetch
    var name = $('.give-id-name').val();
    var id = $('.give-id-id').val();
    // --------- //
    if(name.length > 0 && id.length >1) {
    $('.alert-text').text("Đã cấp mã thành công cho " + name + " với mã: " + id);
    $('.alert-modal').show();
    } else {
        $('.invalid-text').html("Mã cấp không hợp lệ hoặc tỉnh này đã được cấp mã!");
        $('.invalid-modal').show();
    }
})

$('.register-button').click((e) => {
    e.preventDefault();
    var name = $('.select-name-register').val();
    var username = $('.username-register').val();
    var password = $('.password-register').val(); 
    var confirmPassword = $('.confirmPassword-register').val();
    if( password === confirmPassword && password.length >= 6) {
    $('.alert-text').html("Đã cấp thành công tài khoản cho " + name + "<br/>"+ "Tài khoản: " + username +  "<br />" + "Mật khẩu: " + password);
    $('.alert-modal').show();
    //biến username là tài khoản
    //biến password là mật khẩu
    } else if (password.length < 6) {
        $('.invalid-text').text("Mật khẩu phải có độ dài lớn 6!");
        $('.invalid-modal').show();
    } else if (password !== confirmPassword) {
        $('.invalid-text').text("Mật khẩu và xác nhận mật khẩu không khớp!");
    }

})

$('.givePMSButton').click((e) => {
    e.preventDefault();
    var name = $(".select-give-PMS").val();
    var time_start = $('.time-start').val();
    var date_start = $('.date-start').val();
    var time_end = $('.time-end').val();
    var date_end = $('.date-end').val();
    var time_start_deadline = $('.time-start-deadline').val();
    var date_start_deadline = $('.date-start-deadline').val();
    var time_end_deadline = $('.time-end-deadline').val();
    var date_end_deadline = $('.date-end-deadline').val();
    var isValidate = validateTime(time_start, date_start, time_end, date_end, time_start_deadline, date_start_deadline, time_end_deadline, date_end_deadline);
    if(isValidate) {
        // data cho fetch
        var date_and_time_start = date_start + " " + time_start;
        var date_and_time_end = date_end + " " + time_end;
        var id = $('.select-give-PMS').find('option:selected').attr('data-id');
        // ----------
        date_start = modifyDate(date_start);
        date_end = modifyDate(date_end);
        $('.alert-text').html("Đã cấp thành công thời gian khai báo cho " + name + "<br/> Thời gian bắt đầu: " + time_start + ", ngày "+ date_start + "<br/> Thời gian kết thúc: " + time_end +", ngày "+ date_end);
        $('.alert-modal').show();
    } else {
        $('.invalid-text').html("Thời gian bạn nhập không hợp lệ!");
        $('.invalid-modal').show();
    }


})

function validateTime(timeStart, dateStart, timeEnd, dateEnd, timeStartDL, dateStartDL, timeEndDL, dateEndDL) {
    if (dateStart > dateEnd
        || dateStart < dateStartDL
        ||  dateEnd > dateEndDL
        ) {
            return false;
    }
    if (dateStart == dateEnd) {
        if (timeStart > timeEnd) {
            return false;
        }
    }
    if (dateStart == dateStartDL) {
        if (timeStart < timeStartDL) {
            return false;
        }
    }
    if (dateEnd == dateEndDL) {
        if (timeEnd > timeEndDL) {
            return false;
        }
    }
    if (timeStart.length != 5 || timeEnd.length != 5
        || dateStart.length != 10 || dateEnd.length != 10) {
        return false;
    }
    return true;
}

$('.confirmButton').click(() => {
    $('.alert-modal').hide();
})

hideAndShow('.announce-modal','','.announce-confirm-button');
hideAndShow('.invalid-modal','','.rewriteButton');

function modifyDate (date) {
    var day = date.slice(date.length - 2, date.length );
    var month = date.slice(date.length - 5, date.length -3);
    var year = date.slice(0, 4);
    var newDate = day + "/" + month + "/" + year;
    return newDate;
}


// Hàm để thêm value vào phần cấp tài khoản
function addValueToSelectTag(tag,name, id) {
    var nameOption = $("<option></option>").text(name);
    nameOption.attr("value", name);
    nameOption.attr("data-id", id);
    $(tag).append(nameOption);
}

addValueToSelectTag('.select-name-register', "thanh hóa", '11');

// Hàm để lắng nghe mỗi khi thẻ select thay đổi thì thẻ value của thẻ input cũng thay đổi
$('.select-name-register').on('change', () => {
    var x = $('.select-name-register').find('option:selected').attr('data-id');
    $('.username-register').val(x);
})

$('.submit-update-info-button').click((e) => {
    e.preventDefault();
    var oldPassword = $('.oldPassword').val();
    var newPassword = $('.newPassword').val();
    var confirmNewPassword = $('.confirmNewPassword').val();
    if (newPassword === confirmNewPassword && 1/* password dung' */ && newPassword.length >=6) {
        $('.alert-text').html("Đã đổi mật khẩu thành công!");
        $('.alert-modal').show();
        var username = $('.userName').val();
    } else if (newPassword !== confirmNewPassword) {
        $('.invalid-text').html("Mật khẩu mới và nhập lại mật khẩu không khớp!");
        $('.invalid-modal').show();
    } else if (0 /* Password cũ sai */) {
        $('.invalid-text').html("Mật khẩu cũ không đúng");
        $('.invalid-modal').show();
    } else if (newPassword.length < 6) {
        $('.invalid-text').html("Mật khẩu phải có tối thiểu 6 kí tự!");
        $('.invalid-modal').show();
    }
})


function addProvidedAccount(stt, name, username) {
    var sttDiv = $("<div></div>").text(stt);
    var nameDiv = $("<div></div").text(name);
    var usernameDiv = $("<div></div>").text(username);
    var main = $('<div></div>');
    sttDiv.addClass("c-1-ac bor-right-2");
    nameDiv.addClass("c-2-ac bor-right-2");
    usernameDiv.addClass("c-3-ac");
    if (stt % 2 == 1) {
        main.addClass('odd-line');
    }
    main.addClass("dis-flex main");
    main.append(sttDiv,nameDiv,usernameDiv);
    $('.mainTable').append(main);   
}

for (var i = 0; i < 50; i++) {
    addProvidedAccount(i, 'name',1);
}

hideAndShow('.providedAccount-modal', '.showTable-button', '.confirmProvidedButton');
$('.showTable-button').click((e) => {
    e.preventDefault();
})
const url = window.location.href.slice(0, 30);
fetch(url)
    .then(data => data.json())
    .then(citizens => {
        citizens.forEach(citizen => {
            addInfoCitizen(citizen.citizen_id, citizen.citizen_name, citizen.citizen_gender, citizen.date_of_birth, citizen.occupation, citizen.citizen_nationality);
        });
    })