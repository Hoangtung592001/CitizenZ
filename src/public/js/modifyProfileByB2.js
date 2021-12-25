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
}
 
function insertTonGiao(value, text) {
 
    var sel = document.getElementById('tongiao');
    var optionT = document.createElement('option');
    optionT.value = value;
    optionT.innerText = text;
    sel.appendChild(optionT);
}
 
var oke = false;
 
function chinhsua() {
    if (oke == true) {
        return;
    }
    oke = true;
    gangiatri();
    var notify = document.getElementById('notify');
    notify.style.display = 'block';
    var notitext = document.getElementById('textnotify');
    fetch(`http://localhost:5000/information/change_info_by_b2/${window.location.href.slice(52)}`, {
        method: 'PUT',
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
        })
    })
    .then(data => data.json())
    .then(response => {
        notitext.innerText = response.msg;
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

function xoa() {
    //delete_citizen
    var notify = document.getElementById('notify');
    notify.style.display = 'block';
    var notitext = document.getElementById('textnotify');
    gangiatri();
    fetch(`http://localhost:5000/information/delete_citizen/${cmnd}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(data => data.json())
    .then(response => {
        notitext.innerText = response.msg;
    })
    setTimeout(() => {
        location.replace("/")
    }, 2000)
}

fetch('http://localhost:5000/information/get_ethnic_groups')
    .then(data => data.json())
    .then(religions => {
        religions.forEach(religion => {
            insertTonGiao(religion.ethnic_id, religion.ethnic_group);
        })
    })
