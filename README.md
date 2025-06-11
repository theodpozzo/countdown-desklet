# Countdown Desklet for Cinnamon

A highly customizable desklet for the Linux Mint Cinnamon desktop that allows you to count down to any specific date and time. Features a full settings panel, extensive styling options, and a visual alarm when the countdown completes.

![desktop](https://github.com/user-attachments/assets/61bd9e3a-8174-4291-9063-a80b00fc31e7)
> ***Note:** The image shows `desktop.png`: an actual screenshot of desklet running on my desktop.*

## Features

This desklet was built to be both powerful and highly configurable.

  - **Precise Countdown:** Set a countdown to any future date **and** time (down to the second).
  - **Customizable Display:** Choose exactly which time units you want to see.
      - Show or hide Days, Hours, Minutes, and Seconds independently.
  - **Full Appearance Control:** Style the desklet's container to perfectly match your desktop theme.
      - Background Color (with transparency/alpha support)
      - Border Color, Width, and Style (e.g., solid, dashed, dotted)
      - Corner Radius
      - Internal Padding
  - **Advanced Typography:** Customize the look of the text.
      - Set a custom font family, font size, and color for both the top label and the countdown numbers independently.
      - Ability to hide the top label text entirely for a minimalist look.
  - **Flashing Alarm:** When the countdown reaches `00 : 00 : 00 : 00`, the numbers will flash like a classic alarm clock to get your attention.
  - **Click to Dismiss:** Simply left-click the desklet once the alarm starts flashing to permanently dismiss it. The alarm will not restart on reload and will only activate again when a new future countdown is set.

## Installation

You can install this desklet in one of two ways.

#### Method 1: Using Git (Recommended)

This is the easiest way to install and stay up-to-date. Open a terminal and run the following command:

```bash
git clone https://github.com/theodpozzo/countdown-desklet.git ~/.local/share/cinnamon/desklets/countdown@theo
```

#### Method 2: Manual Installation

1.  Click the green "Code" button on the GitHub repository page and select **"Download ZIP"**.
2.  Extract the ZIP file.
3.  You will have a folder named something like `theodpozzo-countdown-desklet-main`. **Rename this folder to `countdown@theo`**. This name is critical for Cinnamon to recognize the desklet.
4.  Move the renamed `countdown@theo` folder into the following directory: `~/.local/share/cinnamon/desklets/`.

### Activating the Desklet

1.  After installing, you may need to reload Cinnamon. Press `Alt`+`F2`, type `r`, and press `Enter`.
2.  Right-click on your desktop and select **"Desklets"**.
3.  Find "Countdown" in the list and click the **"Add"** button at the bottom.

The desklet should now appear on your desktop\!

## Configuration

All features of this desklet can be configured through its settings panel.

  - Right-click on the desklet and select **"Configure"**.

![settings](https://github.com/user-attachments/assets/074f9c5f-eb3b-4f78-b18d-ec8c432634ac)
> ***Note:** The image shows `settings.png`: a screenshot of the desklet's settings window.*

The settings panel allows you to control everything from the target date and time to all the visual styles and display options mentioned in the features list.

## Troubleshooting

If the desklet doesn't appear or causes issues after an edit, your first step should be to check Cinnamon's error log.

1.  Press `Alt`+`F2` and type `lg`, then press `Enter`. This opens the "Looking Glass" debugger.
2.  Click on the **"Errors"** tab at the top right.
3.  Look for any messages related to the desklet's UUID: `countdown@theo`. This will often tell you the exact line of code where the error occurred.

## Contributing

Feel free to open an issue on the GitHub repository page to report bugs or suggest new features. Pull requests are also welcome\!

## License

This project is licensed under the MIT License. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
