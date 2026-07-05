Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "open-vs-code.bat" & chr(34), 0
Set WshShell = Nothing