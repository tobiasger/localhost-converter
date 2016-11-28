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
    height: 150,
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
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAB1CAMAAABDL46zAAAAM1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACjBUbJAAAAEHRSTlMAECAwQFBgcICPn6+/z9/vIxqCigAAA3JJREFUeAHtmeGS5CYMhDEGLDCgfv+nTXb3fJm6weodcpOrSvH92pqyaUktwLBusVgsFovFYrFY/GaiiBzhbzb3n7EdteNCa60p7O697FJrVQDIIqXW2vBFz++T9kV/iKR/yruHkL9CqeGzGOlUDKgyGdhWAGhJYVjUWBSo3gnuacm9TBIFSrDiyoACaMOK+1gA1FdzLgBacCaCD+Q+MFFAXmsnoB6bbUMDagaQjQY5gba9IKtQ70yCQuPXyMWa9grdX5DtJMoEtP3667DGanSsi6RonvpQrtEOO6Ot43TfQYCTRLjpY3Gr7eEORMcJRg+OlTa1heVblW5Wg44ruyuyXenMewrYeEWOp1+C/ULguZy8IuV5manOoPBKNyTW7oOKeEWwK13YoEoi80Mzs51wAElHIdSIkYIHvDMQsmwBjnDiGFuYyWuWxd7WNRILUGdAlq2ESnTz3esdiU3QQIpoURHvHKws4mbY68nKDHjDAItNbysS0ZyN3D9RUNi7/fZVIbqGi2E+4crW0YhuWS90UbrLZme9ka1h+1y1InSim1/oymPcAkL3SXOT5DYFtLGusM25O6rL1w6uy5czrsvXpUx02QNcVyAz7zXEd+gCfmIvItOQ13mHsnasjm/evCJ0WP4Aj5vrJpxUl32Kcl1i+oRuwfFHdCvC++s8p9tJX71JN0Ddn9AtKDPzwEP/nW5DYLvcxMKg2Pk2SpZfshBOfG4YBc3IbBokKyiZPONGFrGg8JPkxMeoItFCzaeboMaXtUm/7YCA+XTdpjhIoasxt22iEdlBjsceCLO6p2VEJTcg+c6JgpMfnM1b1kbOOHncM2zuix3YrhDbJaThr+J4S5KBTYvzQNgrCu2qzvwnvVWee4uYQw+Ll8V62IG17ZcSqP/OdQwTrkDdzd5qyegpY+clHAoUb/UeejBuY410bfwJS3kTBfJP2dMxKk33IlRAZbP+edTS7lw0Lr2Nqw+ijCoix9DrqABaAbis6wMnmPIHvaRtUOwKAM1R8mBHsPFJRE4FgPNJOik+0Eyuj8Tod5sgDT+KLvFzrCDSgZ68dJjTPZ1XC87hj4Yv9PonsKafbpwSB0YkKR1AZ9kSfBSRrPig5QclAQAtIlIfUQDosrvfgw8h/PqTSMczXSS4dxM+zQ8P7G6xWCwWi8Visfjf8Rfl/zV5YY4CIgAAAABJRU5ErkJggg==`
