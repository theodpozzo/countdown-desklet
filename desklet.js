const Desklet = imports.ui.desklet;
const Lang = imports.lang;
const St = imports.gi.St;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;
const Settings = imports.ui.settings;
const Gettext = imports.gettext;

const UUID = "countdown@theo";
Gettext.bindtextdomain(UUID, GLib.get_home_dir() + "/.local/share/locale");

function _(str) {
    return Gettext.dgettext(UUID, str);
}

// Helper function to get the target date
function getTargetDate(countdownDate, countdownTime) {
    if (!countdownDate || !countdownTime) {
        return new Date();
    }
    const d = countdownDate.d || 22;
    const m = countdownDate.m || 4;
    const y = countdownDate.y || Date.now().getFullYear() + 1; // Default to next year if not set
    const hour = countdownTime.h || 0;
    const min = countdownTime.m || 0;
    const sec = countdownTime.s || 0;
    return new Date(y, m - 1, d, hour, min, sec);
    // This is defaulting to midnight on April 22nd next year if no date is set
    // I wonder why?
}

// Helper function to calculate time parts
function calcTimeParts(targetDate) {
    const now = new Date();
    let diff = Math.max(0, targetDate.getTime() - now.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);
    return { days, hours, minutes, seconds };
}

function MyDesklet(metadata, deskletId) {
    this._init(metadata, deskletId);
}

MyDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,
    _init: function (metadata, deskletId) {
        Desklet.Desklet.prototype._init.call(this, metadata, deskletId);
        this.setHeader(_("Countdown"));

        this.settings = new Settings.DeskletSettings(this, this.metadata["uuid"], deskletId);

        const settingsProperties = [
            "labelText", "countdownDate", "countdownTime", "showLabel", "fontFamilyLabel", 
            "fontSizeLabel", "colorLabel", "fontFamilyCountdown", "fontSizeCountdown", "colorCountdown", 
            "backgroundColor", "borderColor", "borderWidth", "cornerRadius", "padding", 
            "showDays", "showHours", "showMinutes", "showSeconds"
        ];
        
        settingsProperties.forEach(prop => {
            this.settings.bindProperty(Settings.BindingDirection.IN, prop, prop, this.updateUI, null);
        });

        this.settings.bindProperty(Settings.BindingDirection.IN, "refreshInterval", "refreshInterval", this.refreshCountdown, null);

        this._setupLayout();
        
        this.countdownTimeout = null;
        this.alarmTimeout = null;
        // The state variable to track if the alarm has been dismissed
        this.alarmAcknowledged = false;

        this.updateUI();
        this.refreshCountdown();
    },

    _setupLayout() {
        this.window = new St.BoxLayout({ vertical: true, style_class: 'desklet', reactive: true });
        this.textLabel = new St.Label({ style_class: 'main-label' });
        this.daysLabel = new St.Label({ style_class: 'countdown-label' });

        this.window.add_actor(this.textLabel);
        this.window.add_actor(this.daysLabel);
        this.setContent(this.window);
    },

    on_desklet_clicked: function(event) {
        if (this.alarmTimeout) {
            // Set the acknowledged flag to true when the user stops the alarm
            this.alarmAcknowledged = true;
            this.stopAlarm();
        }
        return false;
    },

    isFinished() {
        const target = getTargetDate(this.countdownDate, this.countdownTime);
        return new Date() >= target;
    },
    
    getCountdownString() {
        if (!this.countdownDate) return "Set Date";

        const target = getTargetDate(this.countdownDate, this.countdownTime);
        const time = calcTimeParts(target);
        
        const displayParts = [];
        function pad(n) { return n.toString().padStart(2, '0'); }

        if (this.showDays)    displayParts.push(pad(time.days));
        if (this.showHours)   displayParts.push(pad(time.hours));
        if (this.showMinutes) displayParts.push(pad(time.minutes));
        if (this.showSeconds) displayParts.push(pad(time.seconds));
        
        if (displayParts.length === 0) return "Check what to show";

        return displayParts.join(' : ');
    },

    updateUI: function () {
        if (!this.window) return;

        this.window.set_style(
            `background-color: ${this.backgroundColor};` +
            `border: ${this.borderWidth}px solid ${this.borderColor};` +
            `border-radius: ${this.cornerRadius}px;` +
            `padding: ${this.padding}px;`
        );

        this.textLabel.set_text(this.labelText);
        this.textLabel.set_style(
            `font-family: "${this.fontFamilyLabel}";` +
            `font-size: ${this.fontSizeLabel}pt;` +
            `color: ${this.colorLabel};`
        );
        this.textLabel.visible = this.showLabel;

        this.daysLabel.set_text(this.getCountdownString());
        this.daysLabel.set_style(
            `font-family: "${this.fontFamilyCountdown}";` +
            `font-size: ${this.fontSizeCountdown}pt;` +
            `color: ${this.colorCountdown};`
        );
    },

    startAlarm() {
        if (this.alarmTimeout) return;
        this.alarmTimeout = Mainloop.timeout_add(500, Lang.bind(this, this.animateAlarm));
    },
    
    stopAlarm() {
        if (this.alarmTimeout) {
            Mainloop.source_remove(this.alarmTimeout);
            this.alarmTimeout = null;
            this.daysLabel.opacity = 255;
        }
    },

    animateAlarm() {
        this.daysLabel.opacity = (this.daysLabel.opacity === 255) ? 0 : 255;
        return true;
    },

    refreshCountdown: function () {
        this.updateUI();

        // Check the state and manage the animations
        if (this.isFinished()) {
            // Only start the alarm if the countdown is finished AND it hasn't been acknowledged yet
            if (!this.alarmAcknowledged) {
                this.startAlarm();
            }
        } else {
            // If the countdown is for a future date, stop any running alarm and RESET the acknowledged state
            this.alarmAcknowledged = false;
            this.stopAlarm();
        }

        if (this.countdownTimeout) {
            Mainloop.source_remove(this.countdownTimeout);
            this.countdownTimeout = null;
        }

        if (this.refreshInterval === "only-after-starting") {
            return;
        }
        
        const interval = parseInt(this.refreshInterval) || 1;
        this.countdownTimeout = Mainloop.timeout_add_seconds(interval, Lang.bind(this, this.refreshCountdown));
    },

    on_desklet_removed: function () {
        if (this.countdownTimeout) {
            Mainloop.source_remove(this.countdownTimeout);
        }
        if (this.alarmTimeout) {
            Mainloop.source_remove(this.alarmTimeout);
        }
    }
};

function main(metadata, deskletId) {
    return new MyDesklet(metadata, deskletId);
}