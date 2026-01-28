import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template = this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: 'ページ',
        submenu: [
          {
            label: '読み込み',
            click: () =>{
              this.mainWindow.webContents.send("navigate", "/");
            },
          },
          {
            label: '停止',
            click: () =>{
              this.mainWindow.webContents.send("navigate", "/cardStop");
            },
          },
          {
            label: '履歴',
            click: () =>{
              this.mainWindow.webContents.send("navigate", "/histories");
            },
          },

        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: '開発者ツール',
            click: () => {
              this.mainWindow.webContents.toggleDevTools();
            },
          },
        ],
      },

    ];

    return templateDefault;
  }
}
