window.onload =function(){
};
var url = "https://applets.cwp.cool";
function login(){
    var  admin_id = document.getElementById("user").value;
    var  password = document.getElementById("psd").value;
    var xml = new XMLHttpRequest();
    xml.open("POST",url+"/api/admin/login");
    xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xml.onreadystatechange =function(){
        if (xml.readyState==4){
            if (xml.status==200 || xml.status==304){
                const  res = JSON.parse(xml.responseText);
                if(res.code === 200){
                    alert("登录成功！")
                    window.location ="show.html";
                    sessionStorage.setItem("token",res.token);
                }else{
                    alert("用户名或者密码错误!")
                }
            }
        }
    };
    xml.send(`admin_id=${admin_id}&password=${password}`);
};

