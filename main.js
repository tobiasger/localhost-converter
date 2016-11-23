const electron = require("electron")
const {app, BrowserWindow} = electron

app.on("ready", () => {
  let win = new BrowserWindow({width:250, height:150})
  win.loadURL('file://' + __dirname + '/index.html')
})
