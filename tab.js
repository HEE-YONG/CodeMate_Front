var editor;
var tabCount = 2; // 탭 카운트 변수 초기화
var currentTab = "tab1";
var editors = [];

window.onload = function () {
    $("#tab1").show();
    $("#tab_console").hide();
};
$(document).ready(function () {
    $("#index_tab1").click(function () {
        $(".tabs > div").hide();
        $(".footer").show();
        $("#tab1").show();
        currentTab = "tab1";
    });
    $("#append").click(function () {
        var tabName;
        do {
            tabName = prompt(
                "생성할 탭의 이름을 언어에 맞게 입력해주세요.\n예시) hello.c, hello.c++, hello.py, hello.java\n※ C, c++, Python, Java 컴파일 기능만 제공"
            ); // 프롬프트로 탭 이름 입력받기
        } while (tabName && !isValidTabName(tabName)); // 유효한 탭 이름이 아닐 경우 반복해서 입력 받기

        if (tabName) {
            var tabID = "tab" + tabCount; // 탭의 고유 ID 생성
            //var editorID = "editor" + tabCount; // 고유한 editor ID 생성

            var newButton = $("<button>")
                .attr("type", "button")
                .attr("id", "index_" + tabID)
                .text(tabName);
            $("#append").before(newButton); // 탭 버튼을 Default.c 버튼과 "+" 버튼 사이에 삽입

            // 기존 탭 숨김 처리
            $(".tabs > div").hide();

            var newTabDiv = $("<div>").attr("id", tabID).show(); // 새로운 탭의 div 태그 생성
            var newEditorDiv = $("<div>")
                .attr("id", "monaco" + "_tab" + tabCount)
                .css("height", "600px"); // 탭 내용을 표시할 div 태그 생성
            newTabDiv.append(newEditorDiv); // 탭 div에 내용 div 추가
            $("#tab_console").before(newTabDiv); // 탭 div를 "tab_console" 태그 위에 추가

            // 새로운 탭 클릭 시 해당 탭 보여주기
            newButton.click(function () {
                $(".tabs > div").hide();
                $(".footer").show();
                newTabDiv.show();
                currentTab = newTabDiv.attr("id");
            });

            var language = tabName.substring(tabName.lastIndexOf(".") + 1); // 탭 확장자로 language 설정
            var editor = monaco.editor.create(
                document.querySelector("#monaco" + "_tab" + tabCount),
                {
                    theme: "vs-dark",
                    automaticLayout: true,
                    language: language,
                    value: ["int main() {", "", "}"].join("\n"),
                }
            );

            currentTab = newTabDiv.attr("id");
            editors.push(editor);

            tabCount++; // 탭 카운트 증가
        }
    });

    $("#index_console").click(function () {
        currentTab = "tab_console";
        $(".tabs > div").hide();
        $(".footer").hide();
        $("#tab_console").show();
    });
});

function isValidTabName(tabName) {
    var validExtensions = [".c", ".py", ".java", ".c++"];
    var extension = tabName.substring(tabName.lastIndexOf("."));
    return validExtensions.includes(extension);
}

/**************************** Monaco *****************************/
require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs",
    },
});

require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.querySelector("#monaco_tab1"), {
        theme: "vs-dark",
        automaticLayout: true,
        language: "c",
        value: ["int main() {", "", "}"].join("\n"),
    });

    editors.push(editor);
});

/**************************** AI Modal *****************************/

var myModalEl = document.getElementById("staticBackdrop");
var editorReadOnly;

myModalEl.addEventListener("show.bs.modal", function (event) {
    editorReadOnly = monaco.editor.create(
        document.getElementById("monaco-read-only"),
        {
            theme: "vs-dark",
            automaticLayout: true,
            language: "c",
            value: editor.getValue(),
            readOnly: true,
        }
    );
});

function submitChat() {
    var $chat = $("#chat-write");

    if ($chat.val()) {
        $(".modal-chat-content").append(
            $("<div>")
                .prop({
                    className: "user-chat",
                })
                .prepend($("<div>").text("<"))
                .prepend($("<div>").text($chat.val()))
        );

        $chat.val("");
    }
}

$("#clearBtn").click(function () {
    $(".modal-chat-content").empty();
});

$(".btn-close").click(function () {
    editorReadOnly.dispose();
});

$("#chat-write").keydown(function (event) {
    if (event.key === "Enter") {
        submitChat();
    }
});

/**************************** Slide-Window *****************************/

function toggleSlideWindow() {
    const slideContainer = document.querySelector(".slide-container");
    const slideBtn = document.getElementById("btn_input_slide");
    const slideTextarea = document.getElementById("input_text");

    slideContainer.classList.toggle("open");
    slideBtn.classList.toggle("open");
    slideTextarea.classList.toggle("open");
}

/**************************** buttons *****************************/

$("#btn_export").click(function () {});
$("#btn_capture").click(function () {});
$("#btn_copy").click(function () {
    currentTabNum = currentTab[currentTab.length - 1];
    currentEditorValue = editors[currentTabNum - 1].getValue();

    var tempInputElement = document.createElement("textarea");
    tempInputElement.value = currentEditorValue;

    document.body.appendChild(tempInputElement);
    tempInputElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempInputElement);

    alert("값이 복사되었습니다.");
});

$("#btn_run").click(function () {});
