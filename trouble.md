# electron-builder

## npm run dist

```
> electron_react_ts_pasori@0.0.1 dist
> electron-builder

  • electron-builder  version=26.4.0 os=10.0.22621
  • loaded configuration  file=package.json ("build" field)
  • writing effective config  file=dist\builder-effective-config.yaml
  • executing @electron/rebuild  electronVersion=40.0.0 arch=x64 buildFromSource=false workspaceRoot=D:\pasori\electron_react_ts_pasori projectDir=./ appDir=./
  • installing native dependencies  arch=x64
  • completed installing native dependencies
  • packaging       platform=win32 arch=x64 electron=40.0.0 appOutDir=dist\win-unpacked
  • updating asar integrity executable resource  executablePath=dist\win-unpacked\electron_react_ts_pasori.exe
  • default Electron icon is used  reason=application icon is not set
  • downloading     url=https://github.com/electron-userland/electron-builder-binaries/releases/download/winCodeSign-2.6.0/winCodeSign-2.6.0.7z size=5.6 MB parts=1
  • downloaded      url=https://github.com/electron-userland/electron-builder-binaries/releases/download/winCodeSign-2.6.0/winCodeSign-2.6.0.7z duration=962ms
  ⨯ cannot execute  cause=exit status 2
                    out=
    7-Zip (a) 21.07 (x64) : Copyright (c) 1999-2021 Igor Pavlov : 2021-12-26

    Scanning the drive for archives:
    1 file, 5635384 bytes (5504 KiB)
```

- winCodeSign-2.6.0.7z をダウンロードする
- 7z で展開する
- できたフォルダー(winCodeSign-2.6.0)をフォルダーごとコピーする
- コピー先：C:\Users\user\AppData\Local\electron-builder\Cache\winCodeSign

### 7z 展開時

Linkを作れないようなエラーがでるが、無視して進めるとできた。

# SqliteError: no such column: "now" 

```
datetime("now", "localtime")
```
↓
```
datetime('now', 'localtime')
```
# UnhandledPromiseRejectionWarning

UnhandledPromiseRejectionWarning: TypeError: SQLite3 can only bind numbers, strings, bigints, buffers, and null

```
insertQuery.run([data.fcno, data.name, data.kana, data.mail, data.in_room, data.idm])
```
```
insertQuery.run(data.fcno, data.name, data.kana, data.mail, (data.in_room)?1:0, data.idm)
```
