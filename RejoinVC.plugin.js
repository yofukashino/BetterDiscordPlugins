/**
	* @name RejoinVC
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.5
	* @invite SgKSKyh9gY
	* @description This plugin allows you to rejoin a voice channel by a button within 10 seconds of leaving.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/RejoinVC.plugin.js
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
module.exports = (_ => {
    const config = {
        info: {
            name: "RejoinVC",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
                }, {
				name: "Kirai",
				discord_id: "872383230328832031",
				github_username: "HiddenKirai",
			},
            ],
            version: "1.0.5",
            description:
            "This plugin allows you to rejoin a voice channel by a button within 10 seconds of leaving",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/RejoinVC.plugin.js",
		},
        changelog: [{
			title: "v0.0.1",
			items: [
				"Idea in mind"
			]
            }, {
			title: "v0.0.5",
			items: [
				"Base Model"
			]
            }, {
			title: "Initial Release v1.0.0",
			items: [
				"This is the initial release of the plugin :)",
				"Don't leave your homies hanging －O－"
			]
            }, {
			title: "v1.0.1",
			items: [
				"Bug Fixes"
			]
            }, {
			title: "v1.0.2 (I am Dumb, Sorry)",
			items: [
				"Forgot Contributor's Name so added that."
			]
            }, {
			title: "v1.0.3",
			items: [
				"Library Handler"
			]
            }, {
			title: "v1.0.5",
			items: [
				"Added option to change time to show the button"
			]
		}
        ],
        main: "RejoinVC.plugin.js",
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
            DiscordModules,
            Patcher,
            WebpackModules,
            ReactTools,
            Settings
		} = Library;
        const {
            selectVoiceChannel
		} = WebpackModules.getByProps("selectVoiceChannel");
        const dispatcher = WebpackModules.getByProps("dirtyDispatch");
        const CallJoin = DiscordModules.React.createElement(WebpackModules.getByDisplayName("CallJoin"), {
            width: 20,
            height: 20
		});
        return class RejoinVC extends Plugin {
            onStart() {
                this.time = BdApi.loadData(config.info.name, "time") ?? 10000;
                this.PutButton = this.PutButton.bind(this);
                dispatcher.subscribe("VOICE_CHANNEL_SELECT", this.PutButton);
			}
            onStop() {
                Patcher.unpatchAll()
                dispatcher.unsubscribe("VOICE_CHANNEL_SELECT", this.PutButton)
			}
            async PutButton(voice) {
                const classes = await WebpackModules.getByProps('container', 'usernameContainer')
				let PanelButton = WebpackModules.getByDisplayName("PanelButton")
				let Account = ReactTools.getReactInstance(document.querySelector(`.${classes.container}`)).return?.stateNode
				if (voice.currentVoiceChannelId !== null) {
					Patcher.unpatchAll()
					Patcher.after(Account.__proto__, "render", (_, __, {
						props
					}) => {
					props.children[1].props.children.unshift(DiscordModules.React.createElement(PanelButton, {
						icon: () => CallJoin,
						tooltipText: "ReJoin VC",
						onClick: () => {
							Patcher.unpatchAll()
							selectVoiceChannel(voice.currentVoiceChannelId)
						}
					}))
					});
					Account.forceUpdate();
					clearTimeout(this.disappear);
					this.disappear = setTimeout(() => {
						Patcher.unpatchAll();
						Account.forceUpdate();
					}, this.timer);
				}
				
			}
            getSettingsPanel() {
                return Settings.SettingPanel.build(this.saveSettings.bind(this),
                    new Settings.Slider("Show Time", "The Time in seconds to show the button after disconnect.", 5, 60, this.time / 1000, (e) => {
						this.time = e * 1000;
						}, {
						markers: [5, 10, 15, 20, 25, 30, 45, 60],
						stickToMarkers: true
					}))
			}
			saveSettings() {
				BdApi.saveData(config.info.name, "time", this.time);
			}
			
		};
		return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
