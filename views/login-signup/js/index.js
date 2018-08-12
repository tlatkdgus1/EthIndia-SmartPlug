
$(document).ready(function(){
  $('.signup-slider').slick({
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000
  });

  $("img").height($(".main-box").height());

  $(".to-signin").on("click", function () {
    $(this)
      .addClass("top-active-button")
      .siblings()
      .removeClass("top-active-button");
    $(".form-signup").slideUp(500);
    $(".form-signin").slideDown(500);
  });

  $(".to-signup").on("click", function () {
    $(this)
      .addClass("top-active-button")
      .siblings()
      .removeClass("top-active-button");
    $(".form-signin").slideUp(500);
    $(".form-signup").slideDown(500);
  });

  $(".to-signin-link").on("click", function () {
    $(".to-signin")
      .addClass("top-active-button")
      .siblings()
      .removeClass("top-active-button");
    $(".form-signup").slideUp(200);
    $(".form-signin").slideDown(200);
  });

  $(".to-signup-link").on("click", function () {
    $(".to-signup")
      .addClass("top-active-button")
      .siblings()
      .removeClass("top-active-button");
    $(".form-signin").slideUp(200);
    $(".form-signup").slideDown(200);
  });

$('#btn_login').click(function() {
          var mid = $('#txt_mid').val();
          var psw = $('#txt_psw').val();
          $.ajax({
              type : "POST",
              url : "http://blockchain.gachon.ac.kr/user/login",
              data : "mid=" + mid + "&psw=" + psw,
	      dataType: "xml/html/script/json", // expected format for response
	      contentType: "application/json", // send as JSON
              success : function(data, textStatus, xhr) {
                 if (data == 'loginFail') {
                      alert('로그인에 실패하였습니다.')
                  } else {
                      window.location.href = 'main.jsp';
                  }
              },
              error : function(request, status, error) {
                  alert("code:" + request.status + "\n" + "error:" + error);
              } 
          })

	});
});












