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
  if (history && history.length > 0) {
    if (updateviews) {
      $.post("/status", {list: localStorage.getItem('history')}, (res) => {
        res.reverse()
        var entries = res.map(mapentries)
        renderTable(entries)
      }, 'json')
    } else {
      history.reverse()
      var entries = history.map(mapentries)
      renderTable(entries)
    }
  }
  
}

$(document).ready(updatehistory)

function mapentries(url) {
  return `<tr><td><p class="shorturl" data-clipboard-text="${window.location.href + url.shorturl}">${window.location.href + url.shorturl}</p></td><td><a href="${url.url}">${url.url}</a></td><td>${url.clicks||0} clicks.</td></tr>`
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