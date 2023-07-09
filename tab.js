var editor;
var tabCount = 2; // 탭 카운트 변수 초기화

window.onload = function () {
  $("#tab1").show();
  $("#tab_console").hide();
};
$(document).ready(function () {
  $("#index_tab1").click(function () {
    $(".codemate-content > div").hide();
    $("#tab1").show();
  });
  $("#append").click(function () {
    var tabName;
    do {
      tabName = prompt(
        "생성할 탭의 이름을 언어에 맞게 입력해주세요.\n예시) hello.c, hello.py, hello.java\n※ C, Python, Java 컴파일 기능만 제공"
      ); // 프롬프트로 탭 이름 입력받기
    } while (tabName && !isValidTabName(tabName)); // 유효한 탭 이름이 아닐 경우 반복해서 입력 받기

    if (tabName) {
      var tabID = "tab" + tabCount; // 탭의 고유 ID 생성

      var newButton = $("<button>")
        .attr("type", "button")
        .attr("id", "index_" + tabID)
        .text(tabName);
      $("#append").before(newButton); // 탭 버튼을 Default.c 버튼과 "+" 버튼 사이에 삽입

      // 기존 탭 숨김 처리
      $(".codemate-content > div").hide();

      var newTabDiv = $("<div>").attr("id", tabID).show(); // 새로운 탭의 div 태그 생성
      var newEditorDiv = $("<div>").addClass("monaco").css("height", "600px"); // 탭 내용을 표시할 div 태그 생성
      newTabDiv.append(newEditorDiv).append("hello"); // 탭 div에 내용 div 추가       //확인을 위해서 hello추가 //현재 div가 생성은 되지만 monaco가 적용되지 않음
      $("#tab_console").before(newTabDiv); // 탭 div를 "tab_console" 태그 위에 추가

      // 새로운 탭 클릭 시 해당 탭 보여주기
      newButton.click(function () {
        $(".codemate-content > div").hide();
        newTabDiv.show();
      });

      tabCount++; // 탭 카운트 증가
    }
  });

  $("#index_console").click(function () {
    $(".codemate-content > div").hide();
    $("#tab_console").show();
  });
});

function isValidTabName(tabName) {
  var validExtensions = [".c", ".py", ".java"];
  var extension = tabName.substring(tabName.lastIndexOf("."));
  return validExtensions.includes(extension);
}
