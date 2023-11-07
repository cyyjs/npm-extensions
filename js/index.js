function notify(msg) {
  chrome.notifications.clear('notify')
  chrome.notifications.create('notify', {
    type: 'basic',
    iconUrl: 'img/128.png',
    title: '通知',
    message: msg
  })
}

function getData(kw, fn) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://www.npmjs.com/search/suggestions?q="+kw, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      let list = []
      try {
        list = JSON.parse(xhr.responseText)
        list = list.map(item => {
          return {
            name: item.name,
            description: item.description,
            version: item.version,
            links: item.links
          }
        })
        fn(list)
      } catch (e) {
        notify(e.message)
        fn([])
      }
    }
  }
  xhr.send()
}

function getItemHtml(item) {
  return `
  <li>
    <div class="title"><span>${item.name}</span><span>v${item.version}</span></div>
    <div class="description">${item.description}</div>
    <div class="btns">
      <a target="_blank" href="${item.links.homepage}">Home</a>
      <a target="_blank" href="${item.links.npm}">NPM</a>
      <a target="_blank" href="${item.links.homepage}">GitHub</a>
    </div>
  </li>
  `
}

function render(list) {
  let ul = document.getElementById('list')
  ul.innerHTML = ''
  let uls = ''
  list.forEach(item => {
    uls += getItemHtml(item)
  })
  ul.innerHTML = uls
}

document.getElementById('keyword').onkeyup = function(event) {
  if (event.keyCode !== 13) {
    return
  }
  let kw = event.target.value
  getData(kw, function(list) {
    render(list)
  })
}