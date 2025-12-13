## Heirloom

Heirloom is a terminal-based pomodoro timer built using the Ink framework.

**Platform Support:** macOS only. Notifications use native macOS AppleScript (`osascript`).

**Focus Mode Users:** To receive notifications while in Focus mode (e.g., Work, Do Not Disturb), allow notifications for `Script Editor` in System Settings → Focus → [Your Focus Mode] → Apps.

## Sessions
A working session can be started using the `heirloom start [-t] [-d]` command:
- `-t`: number of minutes to focus for.
- `-d`: a brief descirption of the task.
After time is up, a soft notification will be sent in your OS. A session can be stopped explicitly with the end command: `heirloom end`.

All session events are logged and may be viewed with the `heirloom history` command, providing a rolled up view of session durations, descriptions, and 30-day success rates. 