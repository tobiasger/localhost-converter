const {app, BrowserWindow, ipcMain, Tray, nativeImage} = require('electron')
const path = require('path')

const assetsDir = path.join(__dirname, 'assets')


let tray = undefined
let window = undefined


// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Setup the menubar with an icon
  let icon = nativeImage.createFromDataURL(base64Icon)
  tray = new Tray(icon)

  // Remove dock icon on launch
  // app.dock.hide()

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', function(event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })

  // Make the popup window for the menubar
  window = new BrowserWindow({
    width: 250,
    height: 130,
    show: false,
    frame: false,
    resizable: false,
  })

  // Tell the popup window to load our index.html file
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Only close the window on blur if dev tools isn't opened
  window.on('blur', () => {
    if(!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
})

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = window.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }


  window.setPosition(x, y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Tray Icon as Base64 so tutorial has less overhead
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjYTZmNTI2OC0yZWUzLTQzNDEtYTk4Yy01ZmJhMGQ0NmE4ZmQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUZDRDU3NUVCMEMxMTFFNkFENDlBMUM3Mjc5QTQwRTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUZDRDU3NURCMEMxMTFFNkFENDlBMUM3Mjc5QTQwRTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MzE0NGNiZC1jNTE3LTRlZTEtOGUzZS05NTY2NGJhN2E2NmEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Y2E2ZjUyNjgtMmVlMy00MzQxLWE5OGMtNWZiYTBkNDZhOGZkIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+n9NOUQAAATFJREFUeNpi/P//PwM1AQsyx8TEQRKLmudnzhwg2kAmNL4eEN9EwiA+L9Ai8lwIBPOBuB2IDwGxHZSvToqXmbCIbQfio1CaZIDNwAtoNMUGgsBWIDagloGVQGwLxJ7UMDARiDWhbAkonyTACEvY0KTBCxV/CsRaQPwRiD+DBIhNi+gu/EyAT5KBINe5A3ELlF8K5TOQklOwJezJQHwdiF/AEjYwOD4jBQc28BlmKa6EfQItYYMMs0LLljBshWwZCzbrgLblQyNqNZDihwp7QV3fDuUbQJMWSI00XgOhhk2EJhv0pGMDtNAblJOAarih6ZYBn4GeUIWwMKyBirdAxbZDLTSAFiB4IyUR6gWYraFIyWcb1IJctOIsFJeBIE3HkMMDLS0ew1OUfcbIKdQCAAEGAGLsU/kwaSpnAAAAAElFTkSuQmCC`
