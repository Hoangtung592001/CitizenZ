function forget(x) {
    x.style.display = 'none';
    var dangnhap = document.getElementById('login').getElementsByTagName('button')[0];
    dangnhap.innerHTML = 'Gửi xác nhận';
    var password = document.getElementById('password');
    password.style.display = 'none';
}
function login(x) {
    if (x.innerHTML != "Đăng nhập") {
        var tk = document.getElementById("taikhoan");
        tk.value = tk.value.trim();
        if (tk.value == "") {
            alert('Bạn chưa nhập gì cả');
            return;
        }
        x.innerHTML = "Đăng nhập";
        var password = document.getElementById('password');
        password.style.display = '';
        var fg = document.getElementById('forget').getElementsByTagName('button')[0];
        fg.style.display = "";
        tk.value = "";
    }
}