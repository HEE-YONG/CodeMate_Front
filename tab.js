var editor;
var tabCount = 2; // 탭 카운트 변수 초기화

window.onload = function () {
    $("#table1").show();
    $("#table2").hide();
    $("#table3").hide();
    $("#table4").hide();
};
$(document).ready(function () {
    $("#index_tab1").click(function () {
        $("#table1").show();
        $("#table2").hide();
        $("#table3").hide();
        $("#table4").hide();
    });
    $("#append").click(function () {
        var tabName;
        do {
            tabName = prompt(
                "생성할 탭의 이름을 언어에 맞게 입력해주세요.\n예시) hello.c, hello.py, hello.java\n※ C, Python, Java 컴파일 기능만 제공"
            ); // 프롬프트로 탭 이름 입력받기
        } while (tabName && !isValidTabName(tabName)); // 유효한 탭 이름이 아닐 경우 반복해서 입력 받기

        if (tabName) {
            var tabID = "index_tab" + tabCount; // 탭의 고유 ID 생성
            var newButton = $("<button>")
                .attr("type", "button")
                .attr("id", tabID)
                .text(tabName);
            $("#index_tab1").after(newButton); // 탭 버튼을 Default.c 버튼과 + 버튼 사이에 삽입
            tabCount++; // 탭 카운트 증가
        }
    });
    $("#index_console").click(function () {
        $("#table1").hide();
        $("#table2").hide();
        $("#table3").show();
        $("#table4").hide();
    });
    $("#ai").click(function () {
        $("#table1").hide();
        $("#table2").hide();
        $("#table3").hide();
        $("#table4").show();
    });
});

function isValidTabName(tabName) {
    var validExtensions = [".c", ".py", ".java"];
    var extension = tabName.substring(tabName.lastIndexOf("."));
    return validExtensions.includes(extension);
}
