# Linux notes

## WSL

For big files or big cloud deployments, keep in mind that WSL 2 accesses files in the Windows OS much slower than in the native Linux OS. If WSL is acting slow, move your folders to `/home/MYUSER/` [Reference](https://stackoverflow.com/questions/68972448/why-is-wsl-extremely-slow-when-compared-with-native-windows-npm-yarn-processing)

To copy files from source to destination:

```bash
rsync -ah --progress source destination
```
