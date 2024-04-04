var lsCar = [];
var lsCompany = [];
var idUpdate = 0;
var size = 5;
var page = 0;
var sort = "id,asc";
var totalPage = 0;
var search = "";
// // lay acc vua dang nhap
var carLogin = JSON.parse(localStorage.getItem("userLogin"));
var v_carName = carLogin.carName;
var v_password = carLogin.password;

$(function () {
  // alert("Hi");
  getAllCar();
  getAllCompany();
  $("#hello").append("Hi, " + userLogin);
});

function getAllCar() {
  var url =
    "http://localhost:8080/api/v1/car/getAll?size=" +
    size +
    "&sort=" +
    sort +
    "&page=" +
    page +
    "&search=" +
    search;
  $.ajax({
    type: "GET",
    url: url,
    //data: "data",
    dataType: "JSON",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " + btoa(`${v_carName}:${v_password}`)
      );
    },
    success: function (response) {
      lsCar = response.content;
      $("#carBody").empty();
      for (let i = 0; i < lsCar.length; i++) {
        $("#carBody").append(
          `
            <tr>
            <td>${lsCar[i].id}</td>
            <td>${lsCar[i].carName}</td>
            <td>${lsCar[i].licensePlate}</td>
            <td>${lsCar[i].companyName}</td>
            <td>
              <button type="button" class="btn btn-danger" onclick=" deleteCarById(${lsCar[i].id})">Delete</button>
            </td>
            <td>
              <button type="button" class="btn btn-warning" onclick=" getCarById(${lsCar[i].id})">Edit</button>
            </td>
            
          </tr>
         `
        );
      }
      totalPage = response.totalPages;
      $("#page").empty();
      $("#page").append(
        `<li><a href="#" onclick="changePage(1)">&laquo;</a></li>`
      );
      for (let i = 1; i <= totalPage; i++) {
        if (i == response.number + 1) {
          $("#page").append(
            `<li class="active"><a href="#" onclick="changePage(${i})">${i}</a></li>`
          );
        } else
          $("#page").append(
            `<li><a href="#" onclick="changePage(${i})">${i}</a></li>`
          );
      }
      $("#page").append(
        `<li><a href="#" onclick="changePage(${totalPage})">&raquo;</a></li>`
      );
    },
  });
}

function changePage(pageNumber) {
  page = pageNumber - 1;
  getAllCar();
}

function changeSize() {
  size = $("#inputPage").val();
  getAllCar();
}

function handleSearch() {
  search = $("#inputSearch").val();
  page = 0;
  getAllCar();
}

function getAllCompany() {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/api/v1/company/getAll",
    // data: "data",
    dataType: "JSON",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " + btoa(`${v_carName}:${v_password}`)
      );
    },
    success: function (response) {
      lsCompany = response;
      for (let i = 0; i < lsCompany.length; i++) {
        $(inputCompany).append(
          `
        <option value="${lsCompany[i].id}">${lsCompany[i].companyName}</option>
        `
        );
      }
    },
  });
}

function getCarById(id) {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/api/v1/car/findById?id=" + id,
    // data: "data",
    dataType: "JSON",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " + btoa(`${v_carName}:${v_password}`)
      );
    },
    success: function (response) {
      idUpdate = response.id;
      $("#inputCarName").val(response.carName);
      $("#inputLicensePlate").val(response.licensePlate);
      $("#inputCompany").val(response.companyId);
    },
  });
}

function deleteCarById(id) {
  if (confirm("Bạn có muốn xóa không")) {
    // alert("Đang click vào id" + id);
    $.ajax({
      type: "DELETE",
      url: "http://localhost:8080/api/v1/car?id=" + id,
      // data: "data",
      dataType: "dataType",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Basic " + btoa(`${v_carName}:${v_password}`)
        );
      },
      success: function (response) {
        alert("Đã xóa thành công");
        getAllCar();
      },
    });
  }
}

function saveCar() {
  var v_carName = $("#inputCarName").val();
  var v_licensePlate = $("#inputLicensePlate").val();
  var v_companyId = $("#inputCompany").val();
  var car = {
    id: idUpdate,
    carName: v_carName,
    licensePlate: v_licensePlate,
    companyId: v_companyId,
  };
  if (idUpdate == 0) {
    //goi api post (create)
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/api/v1/car",
      data: JSON.stringify(car), // chuyen du lieu xuong BE
      contentType: "application/json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Basic " + btoa(`${v_carName}:${v_password}`)
        );
      },
      success: function (response) {
        alert("Thêm mới thành công");
        getAllCar();
        resetData;
      },
    });
  } else if (idUpdate > 0) {
    $.ajax({
      type: "PUT",
      url: "http://localhost:8080/api/v1/car",
      data: JSON.stringify(car),
      contentType: "application/json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Basic " + btoa(`${v_carName}:${v_password}`)
        );
      },
      success: function (response) {
        alert("Update thành công");
        getAllCar();
        resetData;
        idUpdate = 0;
      },
    });
  }
}
function resetData() {
  $("#inputCarName").val("");
  $("#inputLicensePlate").val("");
}

function handleLogout() {
  localStorage.clear();
  window.open("./login.html", "_self");
}
