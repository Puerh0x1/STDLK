(function () {
  "use strict";

  /* page loader */

  function hideLoader() {
    const loader = document.getElementById("loader");
    loader.classList.add("d-none");
  }

  window.addEventListener("load", hideLoader);
  /* page loader */

  /* Cover img */
  var coverImg = document.querySelectorAll(".cover-image");

  coverImg.forEach((ele) => {
    var attr = ele.getAttribute("data-bs-image-src");
    if (attr && typeof attr !== typeof undefined && attr !== false) {
      ele.style.background = `url(${attr}) center center`;
    }
  });
  /* Cover img */

  /* tooltip */
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  /* popover  */
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );

// ###############

  /* Choices JS */
  document.addEventListener("DOMContentLoaded", function () {
    var genericExamples = document.querySelectorAll("[data-trigger]");
    for (let i = 0; i < genericExamples.length; ++i) {
      var element = genericExamples[i];
      new Choices(element, {
        allowHTML: true,
        placeholderValue: "This is a placeholder set in the config",
        searchPlaceholderValue: "Search",
      });
    }
  });
  /* Choices JS */

  /* footer year */
  document.getElementById("year").innerHTML = new Date().getFullYear();
  /* footer year */

  /* node waves */
  Waves.attach(".btn-wave", ["waves-light"]);
  Waves.init();
  /* node waves */

  /* card with close button */
  let DIV_CARD = ".card";
  let cardRemoveBtn = document.querySelectorAll(
    '[data-bs-toggle="card-remove"]'
  );
  cardRemoveBtn.forEach((ele) => {
    ele.addEventListener("click", function (e) {
      e.preventDefault();
      let $this = this;
      let card = $this.closest(DIV_CARD);
      card.remove();
      return false;
    });
  });
  /* card with close button */

  /* card with fullscreen */
  let cardFullscreenBtn = document.querySelectorAll(
    '[data-bs-toggle="card-fullscreen"]'
  );
  cardFullscreenBtn.forEach((ele) => {
    ele.addEventListener("click", function (e) {
      let $this = this;
      let card = $this.closest(DIV_CARD);
      card.classList.toggle("card-fullscreen");
      card.classList.remove("card-collapsed");
      e.preventDefault();
      return false;
    });
  });
  /* card with fullscreen */

  /* count-up */
  var i = 1;
  setInterval(() => {
    document.querySelectorAll(".count-up").forEach((ele) => {
      if (ele.getAttribute("data-count") >= i) {
        i = i + 1;
        ele.innerText = i;
      }
    });
  }, 10);
  /* count-up */

  /* back to top */
  const scrollToTop = document.querySelector(".scrollToTop");
  const $rootElement = document.documentElement;
  const $body = document.body;
  window.onscroll = () => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const clientHt = $rootElement.scrollHeight - $rootElement.clientHeight;
    if (window.scrollY > 100) {
      scrollToTop.style.display = "flex";
    } else {
      scrollToTop.style.display = "none";
    }
  };
  scrollToTop.onclick = () => {
    window.scrollTo(0, 0);
  };
  /* back to top */

});

function showSearchResult(event) {
  event.preventDefault();
  event.stopPropagation();
  let headerSearch = document.querySelector("#headersearch");
  headerSearch.classList.add("searchdrop");
}
function removeSearchResult(event) {
  let headerSearch = document.querySelector("#headersearch");
  if (
    event.target.classList.contains("header-search") ||
    event.target.closest(".header-search")
  ) {
    return;
  }
  headerSearch.classList.remove("searchdrop");
}

/* full screen */
var elem = document.documentElement;
function openFullscreen() {
  let open = document.querySelector(".full-screen-open");
  let close = document.querySelector(".full-screen-close");

  if (
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
    close.classList.add("d-block");
    close.classList.remove("d-none");
    open.classList.add("d-none");
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
      console.log("working");
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
    close.classList.remove("d-block");
    open.classList.remove("d-none");
    close.classList.add("d-none");
    open.classList.add("d-block");
  }
}
/* full screen */

/* toggle switches */
let customSwitch = document.querySelectorAll(".toggle");
customSwitch.forEach((e) =>
  e.addEventListener("click", () => {
    e.classList.toggle("on");
  })
);
/* toggle switches */

/* header dropdown close button */

/* for cart dropdown */
const headerbtn = document.querySelectorAll(".dropdown-item-close");
headerbtn.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    button.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
    // document.getElementById("cart-data").innerText = `${
    //   document.querySelectorAll(".dropdown-item-close").length}
    //    Items`;
    document.getElementById("cart-icon-badge").innerText = `${
      document.querySelectorAll(".dropdown-item-close").length
    }`;
    if (document.querySelectorAll(".dropdown-item-close").length == 0) {
      let elementHide = document.querySelector(".empty-header-item");
      let elementShow = document.querySelector(".empty-item");
      elementHide.classList.add("d-none");
      elementShow.classList.remove("d-none");
    }
  });
});
/* for cart dropdown */

/* for notifications dropdown */
const headerbtn1 = document.querySelectorAll(".dropdown-item-close1");
headerbtn1.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    button.parentNode.parentNode.parentNode.parentNode.remove();
    document.getElementById("notifiation-data").innerText = `${
      document.querySelectorAll(".dropdown-item-close1").length
    } Unread`;
    // document.getElementById("notification-icon-badge").innerText = `${
    //   document.querySelectorAll(".dropdown-item-close1").length
    // }`;
    if (document.querySelectorAll(".dropdown-item-close1").length == 0) {
      let elementHide1 = document.querySelector(".empty-header-item1");
      let elementShow1 = document.querySelector(".empty-item1");
      elementHide1.classList.add("d-none");
      elementShow1.classList.remove("d-none");
    }
  });
});
/* for notifications dropdown */

/* for messages dropdown */
const headerbtn2 = document.querySelectorAll(".dropdown-item-close2");
headerbtn2.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    button.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
    document.getElementById("message-data").innerText = `${
      document.querySelectorAll(".dropdown-item-close2").length
    } Unread`;
    if (document.querySelectorAll(".dropdown-item-close2").length == 0) {
      let elementHide2 = document.querySelector(".empty-header-item2");
      let elementShow2 = document.querySelector(".empty-item2");
      elementHide2.classList.add("d-none");
      elementShow2.classList.remove("d-none");
    }
  });
});
/* for notifications dropdown */


function isFullyVisible(el, tolerance = 0.5) {
    const elem = document.getElementById(el);
    const rect = elem.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    // Check with tolerance for being within the viewport
    const inViewVertically = rect.top <= windowHeight + tolerance && rect.bottom >= -tolerance;
    const inViewHorizontally = rect.left <= windowWidth + tolerance && rect.right >= -tolerance;
    const inViewport = inViewVertically && inViewHorizontally;

    // Check for CSS visibility, 'hidden' attribute, and dimensions
    const style = getComputedStyle(elem);
    const notHiddenByCSS = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0;
    const notHiddenAttribute = !elem.hidden;
    const hasDimensions = elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;

    return inViewport && notHiddenByCSS && notHiddenAttribute && hasDimensions;
}

const innerDimensions = (el) => {
  const node = document.getElementById(el);
  const computedStyle = getComputedStyle(node);

  let width = node.clientWidth // width with padding
  let height = node.clientHeight // height with padding

  height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
  width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
  return { height, width }
}

function panelToggle(e) {
  const curob = document.getElementById(e+"H");
  let dimen = innerDimensions(e+"H");

  if (dimen.width == 400) {
    curob.style.width = "40px";
    document.getElementById(e+"N").style.display = "none";
    document.getElementById(e+"B").style.opacity = 0;
    document.getElementById(e+"I").classList.remove("bi-chevron-double-left");
    document.getElementById(e+"I").classList.add("bi-chevron-double-right");
  } else {
    curob.style.width = "400px";
    document.getElementById(e+"N").style.display = "block";
    document.getElementById(e+"B").style.opacity = 1;
    document.getElementById(e+"I").classList.remove("bi-chevron-double-right");
    document.getElementById(e+"I").classList.add("bi-chevron-double-left");
  }
}

function copyToClip(e,t) { var ttc; if (t == 1) { ttc = document.getElementById(e).innerText; } else { ttc = e; } var mti = document.createElement("input");mti.type = "text";mti.value = ttc; document.body.appendChild(mti); mti.select(); document.execCommand("Copy"); document.body.removeChild(mti); ztoast('Скопировано в буффер обмена.', {"type": "success",position: "center-center",duration: 3000});}


function dobrow(el) {
  let elid_old = el.getAttribute("data-id");let elmax = el.getAttribute("data-max"); const ta = elid_old.split("_"); 
// alert(elid_old+"|"+elmax+"|"+ta);
  elmax++; el.setAttribute("data-max",elmax); let elid_new=ta[0]+'_'+ta[1]+'_'+ta[2]+'_'+ta[3]+'_'+ta[4]+'_'+elmax;
  const curel = document.querySelector("#root"+elid_old);
  let clone = curel.cloneNode(true);

  let elpri=clone.querySelector('#fld'+elid_old);
  if (elpri) {
    elpri.setAttribute("name","fld"+elid_new);
    elpri.setAttribute("data-t",elid_new);
    elpri.value='';
    elpri.id="fld"+elid_new;
  }
  let elsec = clone.querySelector('#fldsec'+elid_old);
  if (elsec) {
    elsec.setAttribute("name","fldsec"+elid_new);
    elsec.setAttribute("data-t",elid_new);
    elsec.value='';
    elsec.id="fldsec"+elid_new;
  }
//  clone.querySelector('#glaz'+elid_old).setAttribute("data-c",elid_new);
//  clone.querySelector('#addn'+elid_old).innerHTML='<a href="#" class="delme" id="delme'+elid_new+'" data-id="'+elid_new+'" title="удалить"><i class="las la-trash red fs12"></i></a>';
//<div class="input-group-text"><a href="#" class="delme" id="delme'+elid_new+'" data-id="'+elid_new+'" title="удалить"><i class="las la-trash red fs12"></i></a></div>
  clone.querySelector('input[name=ps]').value=elid_new;let newNode = document.createElement('div');newNode.innerHTML='<div class="input-group-text"><a href="#" class="delme" id="delme'+elid_new+'" data-id="'+elid_new+'" title="удалить"><i class="las la-trash red fs12"></i></a></div>';
  clone.querySelector('#inpgrp'+elid_old).appendChild(newNode);
  clone.querySelector('#addn'+elid_old).innerHTML='';
//  clone.querySelector('#addn'+elid_old).id="addn"+elid_new;
  clone.querySelector('#klon'+elid_old).innerHTML='';
  clone.querySelector('#klon'+elid_old).id="klon"+elid_new;
  clone.classList.remove("bord-t","bord-dott","bord-silver");
  clone.querySelector('#row'+elid_old).id="row"+elid_new;
  clone.querySelector('#tit'+elid_old).id="tit"+elid_new;
  clone.id="root"+elid_new;
  curel.after(clone);

  document.querySelector("#delme"+elid_new).addEventListener("click", function(e) { document.getElementById("root"+this.getAttribute("data-id")).remove();topinfo("ИЗМЕНЕНИЯ НЕ СОХРАНЯЛИСЬ");});
  document.querySelector('#fld' + elid_new).addEventListener("blur", function(e) {
    if (this.classList.contains("testphone")) {
      if (phonechk(this.value)) {ztoast("Неверный формат телефона:<div class='ptb5'><font color=yellow>"+this.value+"</font></div>исправьте или очистите поле.", {"type": "error","position": "center-center","showClose": false});this.focus();return false;}
    } else if (this.classList.contains("testemail")) {
      if (emailchk(this.value)) {ztoast("Неверный формат e-mail:<div class='ptb5'><font color=yellow>"+this.value+"</font></div>исправьте или очистите поле.", {"type": "error","position": "center-center","showClose": false});this.focus();return false;}
    }
  });
}

/* test if digits */
function digschk(ob) { let rg = /^[0-9\.\,]+$/i; let inStr = ob.value;	if(!rg.test(inStr)) {ob.value=(inStr.substr(0,(inStr.length -1))); return true;} else { return false; } } 
//const digflds = document.querySelectorAll(".digits"); digflds.forEach((elem) => { elem.addEventListener("input", (e) => { e.preventDefault(); e.stopPropagation(); digschk(elem);});});

/* test if email */
function emailchk(str) {if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(str)) {return false;} else {return true;}}
//const emailflds = document.querySelectorAll(".testemail"); emailflds.forEach((elem) => {elem.addEventListener("blur", (e) => {e.preventDefault();e.stopPropagation();if (elem.value !='') {if (emailchk(elem.value)) {ztoast("Неверный формат e-mail:<div class='ptb5'><font color=yellow>"+elem.value+"</font></div>исправьте или очистите поле.", {"type": "error","position": "center-center","showClose": false});elem.focus();return false;}}});});

/* test if phone */
function phonechk(str) {if (/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i.test(str)) {return false;} else {return true;}}
//const phoneflds = document.querySelectorAll(".testphone");phoneflds.forEach((elem) => {elem.addEventListener("blur", (e) => {e.preventDefault();e.stopPropagation();if (elem.value !='') {if (phonechk(elem.value)) {ztoast("Неверный формат телефона:<div class='ptb5'><font color=yellow>"+elem.value+"</font></div>исправьте или очистите поле.", {"type": "error","position": "center-center","showClose": false});elem.focus();return false;}}});});

/* for dtp | const dtps = document.querySelectorAll(".dtp"); */
// document.querySelectorAll(".dtp").forEach((elem) => { const datepicker = new Datepicker(elem, { language: 'ru', }); });

/* Load URL to app: loadHtml("#app","/teste.html", ); */
function loadHtml(el,url) {fetch(url).then(function (res) {return res.text();}).then(function (body) {document.querySelectorAll(el).forEach((item) => {item.innerHTML = body;const arr = item.getElementsByTagName("script");for (var n = 0; n < arr.length; n++) eval(arr[n].innerHTML);});});};

/* infoMsg, top-right */
function topinfo(msg,bg,co) {let backgr='bg-red'; if (bg) {backgr = bg};let color='white'; if (co) {color = co}; if (msg !='') {msg = '&nbsp; &nbsp;'+msg+'&nbsp; &nbsp;'}; document.querySelector('#topInfoMsg').innerHTML='<span class="' + backgr + ' dis-inline ptb5 fs08 fw600 ' + color + '">' + msg + '</span>';}

/* Show clock while waiting | showclock(1) - show, showclock() - hide */
function showclock(sw) {let el=document.querySelector('#clock');if (sw) {el.style.display = 'block';} else {el.style.display = 'none';} return true;}

/* Previe pics onhover */
// let previews = [...document.querySelectorAll('.preview')].map((element, index) => { return hoverPreview(element, {});});

/* select2 */
// document.querySelectorAll(".select2").forEach((elem) => {const choices = new Choices(elem, {allowHTML: true,removeItemButton: true,});});


/* check if object exists */
function exists(d){if ((d !== null) && (d !== undefined)) {return true;} else {return false;}}

/* Remove picture & files */
function delete_ill(el) {
  if (confirm("Вы удаляете файл без возможности восстановления. Уверены?")) {
    let numc = el.getAttribute("data-id"); let d = new FormData(); d.append('wtd', 'dataRemIll');d.append('numc', numc);
    fetch('/blk/ajax.get', { method: 'POST', body: d, headers: {'Accept': 'application/json'}}).then(data => {data.json().then(res => { return false;})}).catch(error => {});
    let ipl = document.querySelector("#ipl"+numc); if (exists(ipl)) {ipl.remove();}
    let ilp = document.querySelector("#illplc"+numc); if (exists(ilp)) {ilp.remove();}
  }
  return false;
}

async function submitForm(event) {
  showclock(1); event.preventDefault(); var data = new FormData(event.target); await fetch('/blk/ajax.get', { method: 'POST',	body: data, headers: {'Accept': 'application/json'}}).then(data => { data.json().then(res => { if (res.status == 'ok') {if (res.msg) { ztoast(res.msg, {"type": "success",position: "center-center",duration: 5000});topinfo(""); }} else {if (res.msg) { ztoast(res.msg, {"type": "error",position: "center-center",duration: 5000}); }} showclock(0); return false;})}).catch(error => {ztoast('Err: fjs01.01', {"type": "error"});});
}

            
