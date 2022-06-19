/**
	* @name FakeDeafen
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.4
	* @invite SgKSKyh9gY
	* @description FakeDefen to Trick your Friends
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js
*/
/*@cc_on
	@if (@_jscript)
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
	shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
	shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
	fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
	// Show the user where to put plugins in the future
	shell.Exec("explorer " + pathPlugins);
	shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();
@else@*/
module.exports = (() => {
    const config = {
        info: {
            name: "FakeDeafen",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
			},
            ],
            version: "1.0.4",
            description: "FakeDefen to Trick your Friends",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw: "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js",
		},
        changelog: [{
			title: "v0.2.3",
			items: [
				"Easier To use Now"
			]
            }, {
			title: "v0.2.4",
			items: [
				"Reindented file"
			]
            }, {
			title: "v0.2.6",
			items: [
				"Fixed some bugs, and made the code better looking."
			]
            }, {
			title: "v0.3.7",
			items: [
				"Updater Library, Meta Update url having bugs."
			]
            }, {
			title: "v0.3.8",
			items: [
				"Wifey.exe executed, lol ヾ(•ω•`)o."
			]
            }, {
			title: "v0.3.9",
			items: [
				"Refractor"
			]
            }, {
			title: "v0.4.0",
			items: [
				"Library Handler"
			]
            }, {
			title: "Initial Release v1.0.0",
			items: [
				"This is the initial release of the plugin :)",
				"Fool them all (●'◡'●)"
			]
            }, {
			title: "v1.0.2",
			items: [
				"Added Fake Video",
				"Removed Useless code"
			]
		}
		
        ],
        main: "FakeDeafen.plugin.js",
	};
    return !global.ZeresPluginLibrary
	? class {
        constructor() {
            this._config = config;
		}
        getName() {
            return config.info.name;
		}
        getAuthor() {
            return config.info.authors.map((a) => a.name).join(", ");
		}
        getDescription() {
            return config.info.description;
		}
        getVersion() {
            return config.info.version;
		}
        load() {
            try {
                global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.github_raw);
				} catch (err) {
                console.error(this.getName(), "Plugin Updater could not be reached.", err);
			}
            BdApi.showConfirmationModal(
                "Library Missing",
				`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onConfirm: () => {
						require("request").get(
							"https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
							async(error, response, body) => {
								if (error) {
									return BdApi.showConfirmationModal("Error Downloading",
										[
											"Library plugin download failed. Manually install plugin library from the link below.",
											BdApi.React.createElement("a", {
												href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
												target: "_blank"
											}, "Plugin Link")
										], );
								}
								await new Promise((r) =>
									require("fs").writeFile(
										require("path").join(
											BdApi.Plugins.folder,
										"0PluginLibrary.plugin.js"),
										body,
									r));
							});
					},
				});
		}
        start() {}
        stop() {}
	}
	: (([Plugin, Library]) => {
        const {
            WebpackModules,
            Patcher,
            DiscordModules,
            Settings,
            Modals,
			Utilities
		} = Library;
        const {
            getVoiceChannelId
		} = WebpackModules.getByProps('getVoiceChannelId');
        const {
            selectVoiceChannel
		} = WebpackModules.getByProps("selectVoiceChannel");
        const {
            toggleSelfMute
		} = WebpackModules.getByProps("toggleSelfMute")
		const sounds = WebpackModules.getByProps('getDesktopType');
        return class FakeDeafen extends Plugin {
            sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
			}
            showDisclaimer() {
                Modals.showAlertModal("Instructions...", "You can choose either you want to fake mute or defen in settings. \n\n  (By Default it fakes both). \n\n You will retain the set status till you disable the plugin. \n\n You don't need to reload discord for joining another voice chat anymore. \n\n Thats it, Enjoy fooling people ψ(._. )>")
			}
            async onStart() {
                this.mute = Utilities.loadData(config.info.name, "mute", true);
                this.deaf = Utilities.loadData(config.info.name, "deaf", true);
                this.video = Utilities.loadData(config.info.name, "video", false);
                this.firstRun = Utilities.loadData(config.info.name, "firstRun", true);
                if (this.firstRun)
				this.showDisclaimer();
                Utilities.saveData(config.info.name, "firstRun", false);
                await this.fakeIt();
			}
            async fakeIt() {
                const voiceStateUpdate = WebpackModules.getByPrototypes("voiceStateUpdate");
                Patcher.after(voiceStateUpdate.prototype, "voiceStateUpdate", (instance, args) => {
                    instance.send(4, {
                        guild_id: args[0].guildId,
                        channel_id: args[0].channelId,
                        self_mute: this.mute || args[0].selfMute,
                        self_deaf: this.deaf || args[0].selfDeaf,
                        self_video: this.video || args[0].selfVideo
					})
				});
                await this.sleep(500);
                this.update();
			}
            onStop() {
                Patcher.unpatchAll();
                this.update();
			}
            update() {
                const notifications = sounds.getState();
                const toCheck = ["mute", "unmute"];
                const toToggle = toCheck.filter(sound => !notifications.disabledSounds.includes(sound));
                if (toToggle.length > 0)
				notifications.disabledSounds = toToggle.concat(notifications.disabledSounds)
				toggleSelfMute().then(async() => {
					await this.sleep(100);
					toggleSelfMute();
					if (toToggle.length > 0)
					notifications.disabledSounds = notifications.disabledSounds.filter((sound) => !toToggle.includes(sound))
				});
			}
            getSettingsPanel() {
                return Settings.SettingPanel.build(this.saveSettings.bind(this),
                    new Settings.Switch("Mute", "Weather you want to fake the mute or not.", this.mute, (e) => {
                        this.mute = e;
					}),
                    new Settings.Switch("Deaf", "Weather you want to fake the deaf or not.", this.deaf, (e) => {
                        this.deaf = e;
					}),
                    new Settings.Switch("Video", "Weather you want to fake the video or not.", this.video, (e) => {
                        this.video = e;
					}))
			}
            saveSettings() {
                Utilities.saveData(config.info.name, "mute", this.mute);
                Utilities.saveData(config.info.name, "deaf", this.deaf);
                Utilities.saveData(config.info.name, "video", this.video);
                this.update()
			}
		};
        return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
