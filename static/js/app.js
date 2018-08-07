if (!localStorage.getItem('history')) {
  localStorage.setItem('history', JSON.stringify([]))
}

function short() {
  var url = $("#url").val()
  var custom = $("#customurl").val()

  if (url && /http:\/\/|https:\/\//g.test(url)) {
    if (/[^a-zA-Z0-9]/g.test(custom)) {
      M.toast({html: 'Invalid custom url', classes: 'errtoast'});
      return;
    }
    var postdata = { url, custom }
    $.post("/short", postdata, (res) => {
      if (res.sucess) {
        var history = JSON.parse(localStorage.getItem('history'))
        history.push(res.data)
        localStorage.setItem('history', JSON.stringify(history))
        updatehistory()
      } else {
        M.toast({html: res.err, classes: 'errtoast'});
      }
    }, 'json')
  } else {
    M.toast({html: 'Invalid url', classes: 'errtoast'});
  }
}

function updatehistory(updateviews) {
  var history = JSON.parse(localStorage.getItem('history'))
  if (typeof history !== 'undefined' && history.length > 0) {
    if (updateviews) {
      var preres = JSON.parse(localStorage.getItem('history'))
      preres.reverse()
      var preentries = preres.map(url => {return mapentries(url, true)})
      renderTable(preentries)
      $.post("/status", {list: localStorage.getItem('history')}, (res) => {
        localStorage.setItem('history', JSON.stringify(res))
        res.reverse()
        var entries = res.map(url => {return mapentries(url, false)})
        renderTable(entries)
      }, 'json')
    } else {
      history.reverse()
      var entries = history.map(url => {return mapentries(url, false)})
      renderTable(entries)
    }
  }
}

$(document).ready(updatehistory)

function mapentries(url, loading) {
  return `<tr><td><p class="shorturl" data-clipboard-text="${window.location.href + url.shorturl}">${window.location.href + url.shorturl}</p></td><td><a href="${url.url}">${url.url}</a></td><td>${loading ? '<div class="preloader-wrapper active" style="width: 25px;height: 25px;"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>' : `${url.clicks||0} clicks`}</td></tr>`
}

function renderTable(entries) {
  $('#table').html(`<table class="highlight"><thead><tr><th data-field="url">Short Url</th><th data-field="short">Long Url</th></tr></thead><tbody>${entries.join('')}</tbody></table>`)
  $(".shorturl").unbind("click");
  $(".shorturl").click(copy)
  new ClipboardJS('.shorturl')
}

function copy() {
  var width = $(this).width()
  var link = $(this).html()
  if (link == 'Copied.') {
    return;
  }
  $(this).html('Copied.')
  $(this).width(width)
  $(this).css('text-align', 'center')
  $(this).css('color', '#e8e8e8')
  setTimeout(() => {
    $(this).html(link)
    $(this).css('text-align', 'unset')
    $(this).css('color', 'white')
  }, 500)
}