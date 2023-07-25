var editor;
var tabCount = 2; // 탭 카운트 변수 초기화
var currentTab = "tab1";
var editors = [];

window.onload = function () {
    $("#tab1").show();
    $("#tab_console").hide();
    // 캡쳐 버튼 클릭 이벤트 등록
    document
        .getElementById("btn_capture")
        .addEventListener("click", function (e) {
            // 마우스 커서 모양 변경 (eidt_cursor 클래스 추가)
            document.querySelector("body").classList.add("edit_cursor");
            screenshot(e);
        });
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
                "생성할 탭의 이름을 언어에 맞게 입력해주세요.\n예시) hello.c, hello.cpp, hello.py, hello.java\n※ C, C++, Python, Java 컴파일 기능만 제공"
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
            if (language == "py") {
                language = "python";
            }
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
    var validExtensions = [".c", ".py", ".java", ".cpp"];
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
    var currentTabNum = currentTab[currentTab.length - 1];
    var currentEditorValue = editors[currentTabNum - 1].getValue();

    editorReadOnly = monaco.editor.create(
        document.getElementById("monaco-read-only"),
        {
            theme: "vs-dark",
            automaticLayout: true,
            language: "c",
            value: currentEditorValue,
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

$("#btn_copy").click(function () {
    currentTabNum = currentTab[currentTab.length - 1];
    currentEditorValue = editors[currentTabNum - 1].getValue();

    var tempInputElement = document.createElement("textarea");
    tempInputElement.value = currentEditorValue;

    document.body.appendChild(tempInputElement);
    tempInputElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempInputElement);

    let removeToast;
    const toast = document.getElementById("toast");

    toast.classList.contains("reveal")
        ? (clearTimeout(removeToast),
          (removeToast = setTimeout(function () {
              document.getElementById("toast").classList.remove("reveal");
          }, 1000)))
        : (removeToast = setTimeout(function () {
              document.getElementById("toast").classList.remove("reveal");
          }, 1000));
    toast.classList.add("reveal"), (toast.innerText = "복사되었습니다.");
});

$("#btn_run").click(function () {});

/**************************** capture button *****************************/

function screenshot(e) {
    var startX, startY;
    var height = window.innerHeight;
    var width = window.innerWidth;

    // 배경을 어둡게 깔아주기 위한 div 객체 생성
    var $screenBg = document.createElement("div");
    $screenBg.id = "screenshot_background";
    $screenBg.style.borderWidth = "0 0 " + height + "px 0";

    // 마우스 이동하면서 선택한 영역의 크기를 보여주기 위한 div 객체 생성
    var $screenshot = document.createElement("div");
    $screenshot.id = "screenshot";

    document.querySelector("body").appendChild($screenBg);
    document.querySelector("body").appendChild($screenshot);

    var selectArea = false;
    var body = document.querySelector("body");

    // 마우스 누르는 이벤트 함수
    var mousedown = function (e) {
        e.preventDefault();
        selectArea = true;
        startX = e.clientX;
        startY = e.clientY;
        // 이벤트를 실행하면서 이벤트 삭제 (한번만 동작하도록)
        body.removeEventListener("mousedown", mousedown);
    };
    // 마우스 누르는 이벤트 등록
    body.addEventListener("mousedown", mousedown);

    // 클릭한 마우스 떼는 이벤트 함수
    var mouseup = function (e) {
        selectArea = false;
        // (초기화) 마우스 떼면서 마우스무브 이벤트 삭제
        body.removeEventListener("mousemove", mousemove);
        // (초기화) 스크린샷을 위해 생성한 객체 삭제
        $screenshot.parentNode.removeChild($screenshot);
        $screenBg.parentNode.removeChild($screenBg);
        var x = e.clientX;
        var y = e.clientY;
        var top = Math.min(y, startY);
        var left = Math.min(x, startX);
        var width = Math.max(x, startX) - left;
        var height = Math.max(y, startY) - top;
        html2canvas(document.body, {
            // 캡쳐 영역을 지정하여 캡쳐
            x: left,
            y: top,
            width: width,
            height: height,
        }).then(function (canvas) {
            save(canvas); // crop한 이미지 저장
        });
        body.removeEventListener("mouseup", mouseup);
        // 마우스 커서 기본으로 변경
        document.querySelector("body").classList.remove("edit_cursor");
    };
    body.addEventListener("mouseup", mouseup);

    // 마우스무브 이벤트 함수
    function mousemove(e) {
        var x = e.clientX;
        var y = e.clientY;
        $screenshot.style.left = x;
        $screenshot.style.top = y;
        if (selectArea) {
            //캡쳐 영역 선택 그림
            var top = Math.min(y, startY);
            var right = width - Math.max(x, startX);
            var bottom = height - Math.max(y, startY);
            var left = Math.min(x, startX);
            $screenBg.style.borderWidth =
                top + "px " + right + "px " + bottom + "px " + left + "px";
        }
    }
    body.addEventListener("mousemove", mousemove);

    // 캡쳐한 이미지 저장
    function save(canvas) {
        if (navigator.msSaveBlob) {
            var blob = canvas.msToBlob();
            return navigator.msSaveBlob(blob, "파일명.jpg");
        } else {
            var el = document.getElementById("captureImg");
            el.href = canvas.toDataURL("image/jpeg");
            el.download = "파일명.jpg";
            el.click();
        }
    }
}
