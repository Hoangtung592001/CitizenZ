/// ************Lấy giá trị Input************** ///
 
var hovaten = "";
var ngaysinh = "";
var gioitinh = "";
var cmnd = "";
var quequan = "";
var diachithuongtru = "";
var diachitamchu = "";
var tongiao = "";
var trinhdovanhoa = "";
var nghenghiep = "";
var lang = "";

 
function gangiatri() {
 
    var inp = document.getElementsByTagName('input');
    for (let i = 0; i < inp.length; ++i) {
 
        if (i == 0) {
            hovaten = inp[i].value;
        } else if (i == 1) {
            ngaysinh = inp[i].value;
        } else if (i == 2) {
            cmnd = inp[i].value;
        } else if (i == 3) {
            quequan = inp[i].value;
        } else if (i == 4) {
            diachithuongtru = inp[i].value;
        } else if (i == 5) {
            diachitamchu = inp[i].value;
        } else if (i == 6) {
            trinhdovanhoa = inp[i].value;
        } else {
            nghenghiep = inp[i].value;
        }
    }
 
    var sel = document.getElementsByTagName('select');
    gioitinh = sel[0].value;
    tongiao = sel[1].value;
    lang = sel[2].value;
}
 
function insertTonGiao(value, text) {
 
    var sel = document.getElementById('tongiao');
    var optionT = document.createElement('option');
    optionT.value = value;
    optionT.innerText = text;
    sel.appendChild(optionT);
}
 
 
function insertLang(text, value) {
 
    var sel = document.getElementById('lang');
    var optionT = document.createElement('option');
    optionT.value = value;
    optionT.innerText = text;
    sel.appendChild(optionT);
}
 
var oke = false;
 
function nop() {
 
    if (oke == true) {
        return;
    }
    oke = true;
    gangiatri();
    var notify = document.getElementById('notify');
    notify.style.display = 'block';
    var notitext = document.getElementById('textnotify');
    fetch('http://localhost:5000/information/declarationByB1', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            citizen_id: cmnd,
            citizen_name: hovaten,
            date_of_birth: ngaysinh,
            citizen_gender: gioitinh,
            temporary_address: diachitamchu,
            permanent_address: diachithuongtru,
            ethnic_id: tongiao,
            citizen_nationality: 'Việt Nam',
            occupation: nghenghiep,
            educational_level: trinhdovanhoa,
            hometown: quequan,
            village_id: lang
        })
    })
    .then(data => data.json())
    .then(response => {
        if (response.error) {
            notitext.innerText = response.msg;
        }
        else {
            notitext.innerText = response.msg;
            setTimeout(() => {
                location.replace("/")
            }, 2000)
        }
    })
}
 
function okefunc() {
    var notify = document.getElementById('notify');
    notify.style.display = 'none';
    oke = false;
}
 
function chinhTextThongBao(text) {
    var notitext = document.getElementById('textnotify');
    notitext.innerText = text;
}

fetch('http://localhost:5000/information/get_ethnic_groups')
    .then(data => data.json())
    .then(religions => {
        religions.forEach(religion => {
            insertTonGiao(religion.ethnic_id, religion.ethnic_group);
        })
    })
fetch('http://localhost:5000/info_level/get_info_levels/010101')
    .then(data => data.json())
    .then(villages => {
        villages.forEach(village => {
            insertLang(village.name, village.village_id);
        })
    })