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

hideAndShow('.alert-modal','','.alert-confirm-button');

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

for(var i = 0; i < 99; i++) {
    addInfoCitizen(i, 'L?? C??ng Nam', 'Nam', '01/02/2001', 'IT','1','https://google.com');
    //addInfoCitizenByB2(i, 'L?? C??ng Nam', 'Nam', '01/02/2001', 'IT','1','https://google.com');
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


// H??m ????? th??m value v??o ph???n c???p t??i kho???n
function addValueToSelectTag(tag, name, id) {
    var nameOption = $("<option></option>").text(name);
    nameOption.attr("value", name);
    nameOption.attr("data-id", id);
    $(tag).append(nameOption);
}

//http://localhost:5000/get_info/user_info

// H??m ????? l???ng nghe m???i khi th??? select thay ?????i th?? th??? value c???a th??? input c??ng thay ?????i
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
$('.showTable-button').click((e) => {
    e.preventDefault();
})

// T??ng s???a

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
        const date_and_time_start = date_start + " " + time_start + ":00";
        const date_and_time_end = date_end + " " + time_end + ":00";
        const id = $('.select-give-PMS').children('option:selected').attr('data-id');
        // ----------
        date_start = modifyDate(date_start);
        date_end = modifyDate(date_end);
        fetch('http://localhost:5000/get_info/user_info')
            .then(data => data.json())
            .then(user => {
                if (user.role === 'A1') {
                    fetch('http://localhost:5000/level/grant_privileges_cities', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            unitId: id,
                            startTime: date_and_time_start,
                            expiryTime: date_and_time_end
                        })
                    })
                    .then(data => data.json())
                    .then(response => {
                        if (response.error) {
                            $('.alert-text').html(response.msg);
                            $('.alert-modal').show();
                        }
                        else {
                            $('.alert-text').html("???? c???p th??nh c??ng th???i gian khai b??o cho " + name + "<br/> Th???i gian b???t ?????u: " + time_start + ", ng??y "+ date_start + "<br/> Th???i gian k???t th??c: " + time_end +", ng??y "+ date_end);
                            $('.alert-modal').show();
                        }
                    })
                }
                else {
                    fetch('http://localhost:5000/level/grant_privileges_below', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            unitId: id,
                            startTime: date_and_time_start,
                            expiryTime: date_and_time_end
                        })
                    })
                    .then(data => data.json())
                    .then(response => {
                        if (response.error) {
                            $('.alert-text').html(response.msg);
                            $('.alert-modal').show();
                        }
                        else {
                            $('.alert-text').html("???? c???p th??nh c??ng th???i gian khai b??o cho " + name + "<br/> Th???i gian b???t ?????u: " + time_start + ", ng??y "+ date_start + "<br/> Th???i gian k???t th??c: " + time_end +", ng??y "+ date_end);
                            $('.alert-modal').show();
                        }
                    })
                }
            })
    } else {
        $('.invalid-text').html("Th???i gian b???n nh???p kh??ng h???p l???!");
        $('.invalid-modal').show();
    }
})

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
                $('.alert-text').html("???? ?????i m???t kh???u th??nh c??ng!");
                $('.alert-modal').show();
            }
        })
        var username = $('.userName').val();
    } else if (newPassword !== confirmNewPassword) {
        $('.invalid-text').html("M???t kh???u m???i v?? nh???p l???i m???t kh???u kh??ng kh???p!");
        $('.invalid-modal').show();
    } else if (0 /* Password c?? sai */) {
        $('.invalid-text').html("M???t kh???u c?? kh??ng ????ng");
        $('.invalid-modal').show();
    } else if (newPassword.length < 6) {
        $('.invalid-text').html("M???t kh???u ph???i c?? t???i thi???u 6 k?? t???!");
        $('.invalid-modal').show();
    }
})

$('.register-button').click((e) => {
    e.preventDefault();
    const name = $('.select-name-register').val();
    const username = $('.username-register').val();
    const password = $('.password-register').val();
    const confirmPassword = $('.confirmPassword-register').val();
    if( password === confirmPassword && password.length >= 6) {
    //bi???n username l?? t??i kho???n
    //bi???n password l?? m???t kh???u
    fetch('http://localhost:5000/level/grant_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(data => data.json())
    .then(data => {
        if (data.error) {
            $('.alert-text').html(data.msg);
            $('.alert-modal').show();
        }
        else {
            $('.alert-text').html("???? c???p th??nh c??ng t??i kho???n cho " + name + "<br/>"+ "T??i kho???n: " + username +  "<br />" + "M???t kh???u: " + password);
            $('.alert-modal').show();
        }
    })
    } else if (password.length < 6) {
        $('.invalid-text').text("M???t kh???u ph???i c?? ????? d??i l???n 6!");
        $('.invalid-modal').show();
    } else if (password !== confirmPassword) {
        $('.invalid-text').text("M???t kh???u v?? x??c nh???n m???t kh???u kh??ng kh???p!");
        $('.invalid-modal').show();
    }

})

// for (var i = 0; i < 50; i++) {
//     addProvidedAccount(i, 'name',1);
// }

$('.submit-id-button').click((e) => {
    e.preventDefault();
    // data cho fetch
    var name = $('.give-id-name').val();
    var id = $('.give-id-id').val();
    // --------- //
    if(name.length > 0 && id.length >1) {
    fetch('http://localhost:5000/level/grant_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            unitId: id,
            name: name
        })
    })
    .then(data => data.json())
    .then(data => {
        if (data.error) {
            $('.alert-text').text(data.msg);
        }
        else {
            $('.alert-text').text("???? c???p m?? th??nh c??ng cho " + name + " v???i m??: " + id);
        }
    });
    $('.alert-modal').show();
    } else {
        $('.invalid-text').html("M?? c???p kh??ng h???p l??? ho???c t???nh n??y ???? ???????c c???p m??!");
        $('.invalid-modal').show();
    }
})
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
        }
    
})

// Th??m v??o b???ng ???? c???p quy???n
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

fetch('http://localhost:5000/get_info/granted_user', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(data => data.json())
.then(data => {
    data.forEach((unit, index) => {
        addProvidedAccount(index + 1, unit.name, unit.city_id);
    })
});

$('.listGivenPMSButton').click((e) => {
    e.preventDefault();
})
 
hideAndShow('.givenPMS-modal','.listGivenPMSButton','.confirmGivenPMSButton');
 
 
//khi ng?????i d??ng ???n ho??n t???t nh???p
$('.confirmedButton').click(() => {

})

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

fetch('http://localhost:5000/get_info/granted_time_user', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(data => data.json())
.then(data => {
    data.forEach((unit, index) => {
        addGivenPMS(index + 1, unit.name, unit.startTime, unit.expiryTime);
    })
});

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



const url = window.location.href.slice(0, 28);
fetch(url)
    .then(data => data.json())
    .then(villages => {
        villages.forEach(village => {
            addInfo(village.village_id, village.name, village.declaringDone ? 'Nh???p li???u th??nh c??ng!': '??ang nh???p li???u!', village.population, `http://localhost:5000/${village.village_id}/citizen`);
        });
    })

fetch("http://localhost:5000/get_info/analyse_population", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: window.location.href.slice(22, 28)
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