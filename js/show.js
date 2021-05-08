window.onload = function () {
    changeTab(0);
    // 大病求助
    getHelp();
    // 寻人启事
    getFind();
    // 分享文章
    getShare();
};
var url = "https://applets.cwp.cool";
function showMenu(){
    let slider = document.getElementById("slider");
    let slider_ul = document.getElementById("slider-ul");
    if(slider.style.height == "unset" && slider_ul.style.display === "block"){
        slider.style.height = "50px";
        slider_ul.style.display ="none"
    }else{
        slider.style.height = "unset";
        slider_ul.style.display ="block";
    }
 

}
// change tab
function changeTab(index) {
    let main = document.getElementById("main-box");
    main.style.display = "block"
    let detail = document.getElementById("detail-box");
    detail.style.display = "none";
    var show = document.getElementById("table" + index);
    show.style.display = "block"
    for (let i = 0; i < 4; i++) {
        if (i !== index) {
            show.parentNode.children[i].style.display = "none"
        }
    }
}
function upload(){
    let u_form = document.getElementById("upform");
    let formData = new FormData(u_form);
    x= confirm("确定上传此文章吗？")
    if(x == true){
        getData("/api/admin/upload", method = "POST", form = formData, function(data){
            alert("上传成功！")
             u_form.reset()
         })
    }
    
}
function getData(get_url, method = "GET", form = null, callback = null) {
    var xml = new XMLHttpRequest();
    xml.open(method, url + get_url);
    if(method === "POST"){
        xml.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    }
    xml.onreadystatechange = function () {
        if (xml.readyState === 4) {
            if (xml.status === 200 || xml.status === 304) {
                var {
                    code,
                    data
                } = JSON.parse(xml.responseText);
                // console.log(code);
                if (code == 200) {
                    callback(data)
                }else{
                    alert("操作失败，请检查输入的内容或者网络状态！")
                }
            }
        }
    };
    // xml.timeout = 2000;
    // xml.ontimeout =function(){
    //     alert("请检查您的网络状态！")
    // }
    xml.send(form);
};
// 大病求助
function getHelp() {
    getData("/api/admin/helpshow", method = "GET", form = null, function (data) {
        let tbody = document.getElementById("table1-body");
        let str = ``;

        for (const i of data) {

            str +=
                `
            <tr>
            <td>${i.name}</td>
            <td>${i.identity}</td>
            <td>${i.number}</td>
            <td >
                <input type="button" value="查看详情"  class="main-btn"  onclick="goDetail('helpdetail','id',${i.id})"/>
            </td>
            </tr>
            `
        };
        tbody.innerHTML = str;


    });
}
// 寻人启事
function getFind() {
    getData("/api/admin/missingshow", method = "GET", form = null, function (data) {
        let tbody = document.getElementById("table2-body");
        let str = ``;
        // console.log(data);
        for (const i of data) {
            str +=
                `
            <tr>
            <td>${i.name}</td>
            <td>${i.address}</td>
            <td>${i.date}</td>
            <td >
                <input type="button" value="查看详情"  class="main-btn"  onclick="goDetail('missingdetail','id',${i.id})"/>
            </td>
            </tr>
            `
        };
        tbody.innerHTML = str;

    });
}

// 分享文章
function getShare() {
    getData("/api/admin/shareshow", method = "GET", form = null, function (data) {
        let tbody = document.getElementById("table3-body");
        let str = ``;
        for (const i of data) {
            str +=
                `
            <tr>
            <td>${i.tittle}</td>
            <td>${i.type}</td>
            <td >
                <input type="button" value="查看详情"  class="main-btn"  onclick="goDetail('articledetail','article_id',${i.article_id})"/>
            </td>
            </tr>
            `
        };
        tbody.innerHTML = str;

    });
}

function goDetail(path, params, id) {
    let list = {},c_path="",c_params="",d_path="";
    switch (path) {
        case "helpdetail":
            list = {
                tittle: "标题",
                name: "姓名",
                identity: "身份证号码",
                sex: "性别",
                address: "住址",
                explain: "求助说明",
                number: "电话号码"
            };
            c_path="/api/admin/helpcorrect"
            c_params="id";
            d_path="/api/user/helpdelete";
            break;
        case "missingdetail":
            list = {
                id: "文章编号",
                address: "地址",
                date: "日期",
                name: "姓名",
                sex: "性别",
                age: "年龄",
                height: "身高",
                feature: "特点",
                process: "失散过程",
                postscript: "家属附言",
                image_url: "图片",
                tele: "电话",
            }
            c_path="/api/admin/missingcorrect"
            c_params="id";
            d_path="/api/user/missingdelete";
            break;
        case "articledetail":
            list = {
                article_id: "文章编号",
                tittle: "文章标题",
                image_url: "文章的图片",
                content: "文章内容"
            }
            c_path="/api/admin/sharecorrect";
            c_params="article_id";
            d_path="/api/user/articledelete";
            break;

    }
    getData(`/api/user/${path}?${params}=${id}`, method = "GET", form = null, function (data) {
        let main = document.getElementById("main-box");
        let box = document.getElementById("content-box");
        let detail = document.getElementById("detail-box");
        detail.style.display = "block";
        main.style.display = "none";
        let str = ``;
        for (const i in list) {
            str += `
            <div class="detail">
            <div class="detail-left">
                ${list[i]}:
            </div>
            `
            if (i === "image_url") {
                str += `
                <div class="detail-right">
                <image 
                class="detail-img"
                src ="${data[0][i]}"></image>`
            } else {
                str += `
                <div class="detail-right">
                ${data[0][i]}
                `
            }
            str +=
                ` </div>
            </div> 
            `
        }
        let f_ = Object.keys(data[0]);
        let f_key = f_[0];
        let c_id = data[0][f_key];
        str += `
        <div class="btn-box">
            <button  style="background-color: rgb(235, 187, 115);;" onclick="correct('${d_path}','${c_params}','${c_id}')">删除</button>
            <button  style="background-color: #e28282;" onclick="correct('${c_path}','${c_params}','${c_id}','${3}')">审批不通过</button>
            <button style="background-color: #80DDB9;" onclick="correct('${c_path}','${c_params}','${c_id}','${4}')">审批通过</button>
        </div>`
        box.innerHTML = str;
    })
}
// 审批+删除
function correct(path, params, id,pass =null){
    x = confirm("确定此操作吗?");
    let up_form;
    if(pass){
        up_form = `${params}=${id}&pass=${Number(pass)}`
    }else{
        up_form = `${params}=${id}`
    }
    // console.log(up_form);
    if(x === true){
        getData(  path, method = "POST", form = up_form, function (data) {
            let main = document.getElementById("main-box");
            let detail = document.getElementById("detail-box");
            detail.style.display = "none";
            main.style.display = "block";
             // 大病求助
             getHelp();
            // 寻人启事
            getFind();
            // 分享文章
             getShare();
        })
          
    }
    
};