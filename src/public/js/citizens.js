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

async function validateTime(timeStart, dateStart, timeEnd, dateEnd, timeStartDL, dateStartDL, timeEndDL, dateEndDL) {
    await fetch('http://localhost:5000/get_info/user_info')
        .then(data => data.json())
        .then(user => {
            if (user.role === 'A1') {
                return true;
            }
        })
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
    $('.confirmedButton').click(() => {
        fetch('http://localhost:5000/information/declaringDone', {
            method: 'POST'
        })
        $('.warning-modal').hide();
    })
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
function addValueToSelectTag(tag, name, id) {
    var nameOption = $("<option></option>").text(name);
    nameOption.attr("value", name);
    nameOption.attr("data-id", id);
    $(tag).append(nameOption);
}

//http://localhost:5000/get_info/user_info

// Hàm để lắng nghe mỗi khi thẻ select thay đổi thì thẻ value của thẻ input cũng thay đổi
$('.select-name-register').on('change', () => {
    var x = $('.select-name-register').find('option:selected').attr('data-id');
    $('.username-register').val(x);
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


hideAndShow('.providedAccount-modal', '.showTable-button', '.confirmProvidedButton');
hideAndShow('.alert-modal','','.alert-confirm-button');
$('.showTable-button').click((e) => {
    e.preventDefault();
})

// Tùng sửa

$('.submit-update-info-button').click((e) => {
    e.preventDefault();
    const oldPassword = $('.oldPassword').val();
    const newPassword = $('.newPassword').val();
    const confirmNewPassword = $('.confirmNewPassword').val();
    if (newPassword === confirmNewPassword && 1/* password dung' */ && newPassword.length >=6) {
        fetch('http://localhost:5000/set_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmNewPassword: confirmNewPassword
            })
        })
        .then(data => data.json())
        .then(response => {
            if (response.error) {
                $('.alert-text').html(response.msg);
                $('.alert-modal').show();
            }
            else {
                $('.alert-text').html("Đã đổi mật khẩu thành công!");
                $('.alert-modal').show();
            }
        })
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



// for (var i = 0; i < 50; i++) {
//     addProvidedAccount(i, 'name',1);
// }


function hideTimeDeadline() {
    $('.belowA1').hide();
}

fetch('http://localhost:5000/get_info/user_info')
.then(data => data.json())
.then(user => {
    if (user.role === 'A1') {
        hideAddInfoCitizen();
        hideTimeDeadline();
        fetch('http://localhost:5000/get_info/get_info_levels/city')
            .then(data => data.json())
            .then(cities => {
                cities.forEach((city, index) => {
                    addValueToSelectTag('.select-name-register', city.name, city.city_id);
                    addValueToSelectTag('.select-give-PMS', city.name, city.city_id);
                    addGivenId(index + 1, city.name, city.city_id);
                    const defaultValueRegister = $('.select-name-register').children(":selected").attr("data-id");
                    $('.username-register').val(defaultValueRegister);
                })
            })
        const url = window.location.href.slice(0, 30);
        fetch(url)
            .then(data => data.json())
            .then(citizens => {
                citizens.forEach(citizen => {
                    addInfoCitizen(citizen.citizen_id, citizen.citizen_name, citizen.citizen_gender, citizen.date_of_birth, citizen.occupation, citizen.citizen_nationality);
                });
            })
    }
    else if (user.role === 'A2') {
        hideAddInfoCitizen();
        fetch(`http://localhost:5000/get_info/get_info_levels/${user.username}`)
            .then(data => data.json())
            .then(districts => {
                districts.forEach((district, index) => {
                    addValueToSelectTag('.select-name-register', district.name, district.district_id);
                    addValueToSelectTag('.select-give-PMS', district.name, district.district_id);
                    addGivenId(index + 1, district.name, district.district_id);
                    const defaultValueRegister = $('.select-name-register').children(":selected").attr("data-id");
                    $('.username-register').val(defaultValueRegister);
                })
            })
        const url = window.location.href.slice(0, 30);
        fetch(url)
            .then(data => data.json())
            .then(citizens => {
                citizens.forEach(citizen => {
                    addInfoCitizen(citizen.citizen_id, citizen.citizen_name, citizen.citizen_gender, citizen.date_of_birth, citizen.occupation, citizen.citizen_nationality);
                });
            })
    }
    else if (user.role === 'A3') {
        hideAddInfoCitizen();
        fetch(`http://localhost:5000/get_info/get_info_levels/${user.username}`)
            .then(data => data.json())
            .then(wards => {
                wards.forEach((ward, index) => {
                    addValueToSelectTag('.select-name-register', ward.name, ward.ward_id);
                    addValueToSelectTag('.select-give-PMS', ward.name, ward.ward_id);
                    addGivenId(index + 1, ward.name, ward.ward_id);
                    const defaultValueRegister = $('.select-name-register').children(":selected").attr("data-id");
                    $('.username-register').val(defaultValueRegister);
                })
            })
        const url = window.location.href.slice(0, 30);
        fetch(url)
            .then(data => data.json())
            .then(citizens => {
                citizens.forEach(citizen => {
                    addInfoCitizen(citizen.citizen_id, citizen.citizen_name, citizen.citizen_gender, citizen.date_of_birth, citizen.occupation, citizen.citizen_nationality);
                });
            })
    }
    else if (user.role === 'B1') {
        showBelowB1Button();
        $('.addInfoCitizen').click((e)=> {
            e.preventDefault();
            window.location.href = "http://localhost:5000/information/declarationByB1";
        })
        fetch(`http://localhost:5000/get_info/get_info_levels/${user.username}`)
            .then(data => data.json())
            .then(villages => {
                villages.forEach((village, index) => {
                    addValueToSelectTag('.select-name-register', village.name, village.village_id);
                    addValueToSelectTag('.select-give-PMS', village.name, village.village_id);
                    addGivenId(index + 1, village.name, village.village_id);
                    const defaultValueRegister = $('.select-name-register').children(":selected").attr("data-id");
                    $('.username-register').val(defaultValueRegister);
                })
            })
        const url = window.location.href.slice(0, 30);
        fetch(url)
            .then(data => data.json())
            .then(citizens => {
                citizens.forEach(citizen => {
                    addInfoCitizen(citizen.citizen_id, citizen.citizen_name, citizen.citizen_gender, citizen.date_of_birth, citizen.occupation, citizen.citizen_nationality, `http://localhost:5000/information/change_info_by_b1/${citizen.citizen_id}`);
                });
            })
    }
    else if (user.role === 'B2') {
        hideFunctionB2();
        $('.addInfoCitizen').click((e)=> {
            e.preventDefault();
            window.location.href = "http://localhost:5000/information/declaration";
        })
        const url = window.location.href.slice(0, 30);
        fetch(url)
            .then(data => data.json())
            .then(citizens => {
                citizens.forEach(citizen => {
                    addInfoCitizen(citizen.citizen_id, citizen.citizen_name, citizen.citizen_gender, citizen.date_of_birth, citizen.occupation, citizen.citizen_nationality, `http://localhost:5000/information/change_info_by_b2/${citizen.citizen_id}`);
                });
            })
    }
})

// Thêm vào bảng đã cấp quyền
function addGivenPMS(stt, name, dateAndTimeStart, dateAndTimeEnd) {
    var sttDiv = $("<div></div>").text(stt);
    var nameDiv = $("<div></div").text(name);
    var startDiv = $("<div></div>").text(dateAndTimeStart);
    var endDiv = $("<div></div>").text(dateAndTimeEnd);
    var main = $('<div></div>');
    sttDiv.addClass("c-1-gp bor-right-2");
    nameDiv.addClass("c-2-gp bor-right-2");
    startDiv.addClass("c-3-gp bor-right-2");
    endDiv.addClass("c-4-gp");
    if (stt % 2 == 1) {
        main.addClass('odd-line');
    }
    main.addClass("dis-flex main");
    main.append(sttDiv,nameDiv,startDiv,endDiv);
    $('.mainGivenPMSTable').append(main);   
}

function modifyTimeDeadline(dateAndTimeStart, dateAndTimeEnd) {
    var timeStart = dateAndTimeStart.slice(11, 19);
    var dateStart = dateAndTimeStart.slice(0,10);
    var timeEnd = dateAndTimeEnd.slice(11, 19);
    var dateEnd = dateAndTimeEnd.slice(0,10);
    $('.time-start-deadline').val(timeStart);
    $('.date-start-deadline').val(dateStart);
    $('.time-end-deadline').val(timeEnd);
    $('.date-end-deadline').val(dateEnd);
}
 
// test modify Time deadline
// var timeStartTest = "2021-09-20 11:59:00";
// var timeEndTest = "2021-11-20 11:58:00";

function modifyDeadline(timeStart, timeEnd) {
    $('.time_start').text(timeStart);
    $('.time_end').text(timeEnd);
}

function onAnnounce() {
    $('.announce').show();
}

fetch('http://localhost:5000/get_info/user_info')
    .then(data => data.json())
    .then(user => {
        // yyyy/mm/ddT08:
        // "2021-12-31T08:01:03.000Z"   expiry
        // "2021-12-01T08:01:00.000Z"   start
        if (user.startTime === 'Invalid date' || user.expiryTime === 'Invalid date') {
            // 2021-12-24 15:36:21
            user.startTime = "0000-00-00 00:00:00";
            user.expiryTime = "0000-00-00 00:00:00";
            modifyTimeDeadline(user.startTime, user.expiryTime);
        }
        else {
            onAnnounce();
            modifyDeadline(user.startTime, user.expiryTime);
            modifyTimeDeadline(user.startTime, user.expiryTime);
        }
    })


// statistics
function addInfoToStatistic(total, male, female, upperAge, inAge, underAge) {
    $(".total-population").text(total);
    $(".male-citizens").text(male);
    $(".female-citizens").text(female);
    $(".upperLabourAge").text(upperAge);
    $(".inLabourAge").text(inAge);
    $(".underLabourAge").text(underAge);
}



$('.listGivenPMSButton').click((e) => {
    e.preventDefault();
})
 
hideAndShow('.givenPMS-modal','.listGivenPMSButton','.confirmGivenPMSButton');

function addGivenId(stt, name, id) {
    var sttDiv = $("<div></div>").text(stt);
    var nameDiv = $("<div></div").text(name);
    var idDiv = $("<div></div>").text(id);
    var main = $('<div></div>');
    sttDiv.addClass("c-1-ac bor-right-2");
    nameDiv.addClass("c-2-ac bor-right-2");
    idDiv.addClass("c-3-ac");
    if (stt % 2 == 1) {
        main.addClass('odd-line');
    }
    main.addClass("dis-flex main");
    main.append(sttDiv,nameDiv,idDiv);
    $('.mainGivenIdTable').append(main);   
}

$('.listGivenIdButton').click((e) => {
    e.preventDefault();
})

hideAndShow('.givenId-modal','.listGivenIdButton','.confirmGivenIdButton')


function modifyCurrentLevelName(name) {
    $('.currentLevelName').text(name);
}
 
$('.button-search').click((e)=> {
    e.preventDefault();
    var value = $('.input-search').val();
    $('.search-form').attr("action", `http://localhost:5000/get_info/get_info_by_search/${value}`);
	$('.search-form').submit();
})

function showBelowB1Button() {
    $('.belowB1Button').show();
}
 
function hideAddInfoCitizen() {
    $('.addInfoCitizen').hide();
}

function hideFunctionB2() {
    $('.givePMS').hide();
    $('.giveId').hide();
    $('.giveAccount').hide();
    $('.manageDropDownMenu').css('margin-top','16px')
}

fetch("http://localhost:5000/get_info/analyse_population", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: window.location.href.slice(22, 30)
    })
})
.then(data => data.json())
.then(data => {
    const lower18YearsOld = data.lower18YearsOld;
    const upper18YearsOldLower65 = data.upper18YearsOldLower65
    const upper65YearsOld = data.upper65YearsOld
    const numberOfMale = data.numberOfMale
    const numberOfFemale = data.numberOfFemale
    const totalPopulation = data.totalPopulation
    addInfoToStatistic(totalPopulation, numberOfMale, numberOfFemale, upper65YearsOld,upper18YearsOldLower65,lower18YearsOld);
});