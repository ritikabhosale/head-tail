`head [-n count | -c bytes] [file ...]`

```
head [file...]
This filter by default displays 10 lines of each specified file.

head -n count [file...]
This option displays the specified number of lines of each specified file.

head -c count [file...]
This option displays the specified number of bytes of each specified file.
```

`tail [-c # | -n #] [file ...]`

```
tail -- display the last part of a file

tail [file...]
This filter by default display the last 10 lines of a specified file

tail -n count [file...]
This option is number lines

tail -c number [file...]
The location is number bytes
