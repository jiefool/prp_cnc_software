const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron;


//set env
process.env.NODE_ENV = ''
process.setMaxListeners(Infinity);

let mainWindow;
let addWindow;

//Listen for app to be ready
app.on('ready', function(){
  //Create new window
  mainWindow = new BrowserWindow({});
  //Load the html into Window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true,
    icon: path.join(__dirname, 'images/logo_64x64.png'),
  }))

  mainWindow.maximize();

  //Quit app when main window is close
  mainWindow.on('closed', function(){
    app.quit();
  })

  //Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  //Insert Menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping List Item'
  });
  //Load the html into Window
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  addWindow.on('close', function(){
    addWindow = null;
  })
}

//catch item add
ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
})


//create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear')
        }
      },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click(){
          app.quit();
        }
      },
    ]
  }
]


//if mac add empty object to menu
if (process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}


// add developer tools item if not in production
if (process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: 'CommandOrControl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
