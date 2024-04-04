function handleLogin() {
  var v_carName = $("#inputCarName").val();
  var v_password = $("#inputPassword").val();

  $.ajax({
    type: "GET",
    url: "http://localhost:8080/api/v1/login",
    // data: "data",
    dataType: "JSON",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " + btoa(`${v_carName}:${v_password}`)
      );
    },
    success: function (response) {
      alert("Đăng nhập thành công");
      var user = {
        id: response.id,
        carName: v_carName,
        password: v_password,
      };
      localStorage.clear();
      localStorage.setItem("userLogin", JSON.stringify(user));
      window.open("./index.html", "_self");
    },
    error: function (response) {
      alert("Sai thông tin đăng nhập");
    },
  });
}
