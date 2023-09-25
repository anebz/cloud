# Linux notes

## WSL

For big files or big cloud deployments, keep in mind that WSL 2 accesses files in the Windows OS much slower than in the native Linux OS. If WSL is acting slow, move your folders to `/home/MYUSER/` [Reference](https://stackoverflow.com/questions/68972448/why-is-wsl-extremely-slow-when-compared-with-native-windows-npm-yarn-processing)

To copy files from source to destination:

```bash
rsync -ah --progress source destination
```

## To set bashrc colors with the date, relative location and git branch

```bash
if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\D{%T}\[\033[00m\] \[\033[01;34m\]\w\[\033[00m\]\[\033[33m\]$(parse_git_branch)\[\033[00m\]\$ '
else
    PS1='${debian_chroot:+($debian_chroot)}\u:\w\$ '
```
