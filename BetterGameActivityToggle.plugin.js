/**
	* @name BetterGameActivityToggle
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.5
	* @invite SgKSKyh9gY
	* @description Toogle your game activity without opening settings.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterGameActivityToggle.plugin.js
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
            name: "BetterGameActivityToggle",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
			},
            ],
            version: "1.0.5",
            description:
            "Toogle your game activity without opening settings.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterGameActivityToggle.plugin.js",
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
				"Game Activity Toggle looks annoying sometime so this (○｀ 3′○)"
			]
            }, {
			title: "v1.0.1",
			items: [
				"Library Handler"
			]
            }, {
			title: "v1.0.3",
			items: [
				"Changed Icons",
				"More Options, Check plugin settings"
			]
		}
        ],
        main: "BetterGameActivityToggle.plugin.js",
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
            Patcher,
            WebpackModules,
            DiscordModules,
            ReactTools,
            Settings,
            Utilities,
            Toasts
		} = Library;
        const React = DiscordModules.React;
        const enabledIcon = w => React.createElement('svg', {
            viewBox: '0 0 24 24',
            width: w,
            height: w,
            style: {
                'margin-left': '-2px'
			}
			}, React.createElement('path', {
				style: {
					fill: 'currentColor'
				},
				d: 'M17 2H7C4.8 2 3 3.8 3 6V18C3 20.2 4.8 22 7 22H17C19.2 22 21 20.2 21 18V6C21 3.8 19.2 2 17 2ZM10.86 18.14C10.71 18.29 10.52 18.36 10.33 18.36C10.14 18.36 9.95 18.29 9.8 18.14L9.15 17.49L8.53 18.11C8.38 18.26 8.19 18.33 8 18.33C7.81 18.33 7.62 18.26 7.47 18.11C7.18 17.82 7.18 17.34 7.47 17.05L8.09 16.43L7.5 15.84C7.21 15.55 7.21 15.07 7.5 14.78C7.79 14.49 8.27 14.49 8.56 14.78L9.15 15.37L9.77 14.75C10.06 14.46 10.54 14.46 10.83 14.75C11.12 15.04 11.12 15.52 10.83 15.81L10.21 16.43L10.86 17.08C11.15 17.37 11.15 17.85 10.86 18.14ZM14.49 18.49C13.94 18.49 13.49 18.05 13.49 17.5V17.48C13.49 16.93 13.94 16.48 14.49 16.48C15.04 16.48 15.49 16.93 15.49 17.48C15.49 18.03 15.04 18.49 14.49 18.49ZM16.51 16.33C15.96 16.33 15.5 15.88 15.5 15.33C15.5 14.78 15.94 14.33 16.49 14.33H16.51C17.06 14.33 17.51 14.78 17.51 15.33C17.51 15.88 17.06 16.33 16.51 16.33ZM18 9.25C18 10.21 17.21 11 16.25 11H7.75C6.79 11 6 10.21 6 9.25V6.75C6 5.79 6.79 5 7.75 5H16.25C17.21 5 18 5.79 18 6.75V9.25Z'
			}));
			const disabledIcon = w => React.createElement('svg', {
				viewBox: '0 0 24 24',
				width: w,
				height: w,
				style: {
					'margin-left': '-2px'
				}
				}, React.createElement('path', {
                    style: {
                        fill: 'currentColor'
					},
                    d: 'M17 2H7C4.8 2 3 3.8 3 6V18C3 20.2 4.8 22 7 22H17C19.2 22 21 20.2 21 18V6C21 3.8 19.2 2 17 2ZM10.86 18.14C10.71 18.29 10.52 18.36 10.33 18.36C10.14 18.36 9.95 18.29 9.8 18.14L9.15 17.49L8.53 18.11C8.38 18.26 8.19 18.33 8 18.33C7.81 18.33 7.62 18.26 7.47 18.11C7.18 17.82 7.18 17.34 7.47 17.05L8.09 16.43L7.5 15.84C7.21 15.55 7.21 15.07 7.5 14.78C7.79 14.49 8.27 14.49 8.56 14.78L9.15 15.37L9.77 14.75C10.06 14.46 10.54 14.46 10.83 14.75C11.12 15.04 11.12 15.52 10.83 15.81L10.21 16.43L10.86 17.08C11.15 17.37 11.15 17.85 10.86 18.14ZM14.49 18.49C13.94 18.49 13.49 18.05 13.49 17.5V17.48C13.49 16.93 13.94 16.48 14.49 16.48C15.04 16.48 15.49 16.93 15.49 17.48C15.49 18.03 15.04 18.49 14.49 18.49ZM16.51 16.33C15.96 16.33 15.5 15.88 15.5 15.33C15.5 14.78 15.94 14.33 16.49 14.33H16.51C17.06 14.33 17.51 14.78 17.51 15.33C17.51 15.88 17.06 16.33 16.51 16.33ZM18 9.25C18 10.21 17.21 11 16.25 11H7.75C6.79 11 6 10.21 6 9.25V6.75C6 5.79 6.79 5 7.75 5H16.25C17.21 5 18 5.79 18 6.75V9.25Z'
					}), React.createElement('polygon', {
                    style: {
                        fill: '#a61616'
					},
                    points: '22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 '
				}));
				const settingStore = WebpackModules.getByProps('ShowCurrentGame') || {};
				return class BetterGameActivityToggle extends Plugin {
					onStart() {
						this.statusPicker = Utilities.loadData(config.info.name, "statusPicker", true);
						this.userPanel = Utilities.loadData(config.info.name, "userPanel", false);
						this.playAudio = Utilities.loadData(config.info.name, "playAudio", this.userPanel);
						if (BdApi.Plugins.isEnabled(`GameActivityToggle`)) {
							Toasts.show("Disabled GameActivityToogle by DevilBro.", {
								timeout: 7500,
								type: "warning",
								icon: `https://cdn.discordapp.com/attachments/889198641775001670/987911649614757888/872872529344229407.png?size=4096`
							})
							BdApi.Plugins.disable(`GameActivityToggle`)
						}
						if (this.statusPicker)
						this.patchStatusPicker();
						if (this.userPanel)
						this.patchPanelButton();
					}
					patchStatusPicker() {
						const StatusPicker = WebpackModules.getByProps('status', 'statusItem');
						const SideBar = WebpackModules.getByProps('MenuItem');
						Patcher.before(SideBar, 'default', (_, args) => {
							if (args[0]?.navId != 'status-picker')
							return args;
							const enabled = settingStore.ShowCurrentGame.getSetting();
							const [{
								children
							}
							] = args;
							const invisibleStatus = children.find(c => c?.props?.id == 'invisible');
							if (!children.find(c => c?.props?.id == 'game-activity')) {
								children.splice(children.indexOf(invisibleStatus) + 1, 0, React.createElement(SideBar.MenuItem, {
									id: 'game-activity',
									keepItemStyles: true,
									action: () => {
										return settingStore.ShowCurrentGame.updateSetting(!settingStore.ShowCurrentGame.getSetting());
									},
									render: () => React.createElement('div', {
										className: StatusPicker.statusItem,
										'aria-label': `${enabled ? 'Hide' : 'Show'} Game Activity`
										}, enabled ? disabledIcon('16') : enabledIcon('16'), React.createElement('div', {
											className: StatusPicker.status
											}, `${enabled ? 'Hide' : 'Show'} Game Activity`), React.createElement('div', {
											className: StatusPicker.description
										}, `${enabled ? 'Disable' : 'Enable'} displaying currently running game in your activity status.`))
								}));
							}
						});
					}
					async patchPanelButton() {
						const classes = await WebpackModules.getByProps('container', 'usernameContainer')
						let PanelButton = WebpackModules.getByDisplayName("PanelButton")
						let Account = ReactTools.getReactInstance(document.querySelector(`.${classes.container}`)).return?.stateNode;
						Patcher.after(Account.__proto__, "render", (_, __, {
							props
						}) => {
						const enabled = settingStore.ShowCurrentGame.getSetting();
						props.children[1].props.children.unshift(DiscordModules.React.createElement(PanelButton, {
                            icon: () => enabled ? enabledIcon('20') : disabledIcon('20'),
                            tooltipText: `${enabled ? 'Hide' : 'Show'} Game Activity`,
                            onClick: () => {
                                settingStore.ShowCurrentGame.updateSetting(!settingStore.ShowCurrentGame.getSetting());
                                Account.forceUpdate();
                                if (this.playAudio)
								this.playToggleAudio(enabled)
							}
						}))
						});
					}
					playToggleAudio(toggle) {
						const sound = toggle ? `https://cdn.discordapp.com/attachments/887750789781676092/983839535916015656/erro.mp3` : `https://cdn.discordapp.com/attachments/887750789781676092/983839537463705650/inicio-windows.mp3`;
						window.toggleGameActivity = new Audio(sound);
						window.toggleGameActivity.pause();
						window.toggleGameActivity.loop = false;
						window.toggleGameActivity.volume = 1;
						window.toggleGameActivity.play();
					}
					onStop() {
						Patcher.unpatchAll();
					}
					getSettingsPanel() {
						return Settings.SettingPanel.build(this.saveSettings.bind(this),
							new Settings.Switch("Status Picker", "Add Option in status Picker to toogle game activity.", this.statusPicker, (e) => {
								this.statusPicker = e;
							}),
							new Settings.Switch("User Panel", "Add Button in in user panel to toogle game activity.", this.userPanel, (e) => {
								this.userPanel = e;
							}),
							new Settings.Switch("Play Audio", "Play Audio on clicking button in user panel.", this.playAudio, (e) => {
								this.playAudio = e;
							}))
					}
					saveSettings() {
						Utilities.saveData(config.info.name, "statusPicker", this.statusPicker);
						Utilities.saveData(config.info.name, "userPanel", this.userPanel);
						Utilities.saveData(config.info.name, "playAudio", this.playAudio);
						Patcher.unpatchAll();
						this.start();
					}
				};
				return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
