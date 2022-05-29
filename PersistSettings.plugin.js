/**
	* @name PersistSettings
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.2
	* @invite SgKSKyh9gY
	* @description Backs up your settings and restores them in case discord clears them after logouts or for other reasons.
	* @website https://wife-ruby.ml
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PersistSettings.plugin.js
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
			name: "PersistSettings",
			authors: [
				{
					name: "Ahlawat",
					discord_id: "887483349369765930",
					github_username: "Tharki-God",
				},
			],
			version: "1.0.2",
			description:
			"Backs up your settings and restores them in case discord clears them after logouts or for other reasons",
			github: "https://github.com/Tharki-God/BetterDiscordPlugins",
			github_raw:
			"https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PersistSettings.plugin.js",
		},
		changelog: [
			{
				title: "v0.0.1",
				items: [
					"Idea in mind"
				]
			},
			{
				title: "v0.0.5",
				items: [
					"Base Model"
				]
			},
			{
				title: "Initial Release v1.0.0",
				items: [
					"This is the initial release of the plugin :)",
					"Fuck You Discord (>'-'<)"
				]
			},
			{
				title: "v1.0.1",
				items: [
					"Bug Fixes",
					"Library Handler fixed"
				]
			},
		],
		main: "PersistSettings.plugin.js",
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
			}
			catch (err) {
				console.error(this.getName(), "Plugin Updater could not be reached.", err);
			}
			BdApi.showConfirmationModal(
				"Library Missing",
				`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
				{
					confirmText: "Download Now",
					cancelText: "Cancel",
					onConfirm: () => {
						require("request").get(
							"https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
							async (error, response, body) => {
								if (error) {
									return BdApi.showConfirmationModal("Error Downloading",
										[
											"Library plugin download failed. Manually install plugin library from the link below.",
											BdApi.React.createElement("a", { href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", target: "_blank" }, "Plugin Link")
										],
									); }
								await new Promise((r) =>
									require("fs").writeFile(
										require("path").join(
											BdApi.Plugins.folder,
											"0PluginLibrary.plugin.js"
										),
										body,
										r
									)
								);
							}
						);
					},
				}
			);
		}
		start() { }
		stop() { }
	}
	: (([Plugin, Library]) => {		
		const { DiscordModules, Patcher, WebpackModules } = Library;
		const FluxDispatcher = WebpackModules.getByProps("dirtyDispatch");
		
		const AccessiblityEvents = [
			'ACCESSIBILITY_SET_MESSAGE_GROUP_SPACING',
			'ACCESSIBILITY_SET_PREFERS_REDUCED_MOTION',
			'ACCESSIBILITY_DESATURATE_ROLES_TOGGLE',
			'ACCESSIBILITY_DARK_SIDEBAR_TOGGLE',
			'ACCESSIBILITY_SET_SATURATION',
			'ACCESSIBILITY_SET_FONT_SIZE',
			'ACCESSIBILITY_SET_ZOOM'
		];
		
		const VoiceEvents = [
			'AUDIO_SET_DISPLAY_SILENCE_WARNING',
			'AUDIO_SET_AUTOMATIC_GAIN_CONTROL',
			'MEDIA_ENGINE_SET_HARDWARE_H264',
			'MEDIA_ENGINE_SET_VIDEO_DEVICE',
			'AUDIO_SET_NOISE_SUPPRESSION',
			'AUDIO_SET_ECHO_CANCELLATION',
			'MEDIA_ENGINE_SET_OPEN_H264',
			'MEDIA_ENGINE_SET_AEC_DUMP',
			'AUDIO_SET_OUTPUT_VOLUME',
			'AUDIO_SET_OUTPUT_DEVICE',
			'AUDIO_SET_INPUT_DEVICE',
			'AUDIO_SET_ATTENUATION',
			'AUDIO_SET_MODE',
			'AUDIO_SET_QOS'
		];
		
		const NotificationEvents = [
			'NOTIFICATIONS_SET_DISABLE_UNREAD_BADGE',
			'NOTIFICATIONS_SET_PERMISSION_STATE',
			'NOTIFICATIONS_SET_DISABLED_SOUNDS',
			'NOTIFICATIONS_SET_TASKBAR_FLASH',
			'NOTIFICATIONS_SET_DESKTOP_TYPE',
			'NOTIFICATIONS_SET_TTS_TYPE'
		];
		return class PersistSettings extends Plugin {
			constructor(...args) {
				super(...args);
				this.restore = this.restore.bind(this);
				this.backupVoice = this.backupVoice.bind(this);
				this.backupKeybinds = this.backupKeybinds.bind(this);
				this.backupSettings = this.backupSettings.bind(this);
				this.backupExperiments = this.backupExperiments.bind(this);
				this.backupAccessibility = this.backupAccessibility.bind(this);
				this.backupNotifications = this.backupNotifications.bind(this);
			}
			
			
			async onStart()
			{    this.firstRun = BdApi.loadData(config.info.name, "firstRun") ?? true;  
			
				this.experiments = await WebpackModules.getByProps('hasRegisteredExperiment');
				this.notifications = await WebpackModules.getByProps('getDesktopType');
				this.accessibility = await WebpackModules.getByProps('isZoomedIn');
				this.storage = await WebpackModules.getByProps('ObjectStorage');
				this.keybinds = await WebpackModules.getByProps('hasKeybind');
				this.voice = await WebpackModules.getByProps('isDeaf');
				
				FluxDispatcher.subscribe('CONNECTION_OPEN', this.restore);
				FluxDispatcher.subscribe('KEYBINDS_ADD_KEYBIND', this.backupKeybinds);
				FluxDispatcher.subscribe('KEYBINDS_SET_KEYBIND', this.backupKeybinds);
				FluxDispatcher.subscribe('USER_SETTINGS_UPDATE', this.backupSettings);
				FluxDispatcher.subscribe('KEYBINDS_DELETE_KEYBIND', this.backupKeybinds);
				FluxDispatcher.subscribe('KEYBINDS_ENABLE_ALL_KEYBINDS', this.backupKeybinds);
				FluxDispatcher.subscribe('EXPERIMENT_OVERRIDE_BUCKET', this.backupExperiments);
				
				for (const event of AccessiblityEvents) {
					FluxDispatcher.subscribe(event, this.backupAccessibility);
				}
				
				for (const event of VoiceEvents) {
					FluxDispatcher.subscribe(event, this.backupVoice);
				}
				
				for (const event of NotificationEvents) {
					FluxDispatcher.subscribe(event, this.backupNotifications);
				}
				
				// Sometimes CONNECTION_OPEN will fire, other times not soooo lets just do this hack teehee
				setTimeout(() => this.didRestore || this.restore(), 1000 * 10);
				if (this.firstRun) {
				this.backupKeybinds;
				this.backupSettings;
				this.backupExperiments;
				this.backupAccessibility;
				this.backupVoice;
				this.backupNotifications;
				BdApi.saveData(config.info.name, "firstRun", false);
				}
			}
			onStop() {					
				FluxDispatcher.unsubscribe('CONNECTION_OPEN', this.restore);
				FluxDispatcher.unsubscribe('KEYBINDS_ADD_KEYBIND', this.backupKeybinds);
				FluxDispatcher.unsubscribe('KEYBINDS_SET_KEYBIND', this.backupKeybinds);
				FluxDispatcher.unsubscribe('USER_SETTINGS_UPDATE', this.backupSettings);
				FluxDispatcher.unsubscribe('KEYBINDS_DELETE_KEYBIND', this.backupKeybinds);
				FluxDispatcher.unsubscribe('KEYBINDS_ENABLE_ALL_KEYBINDS', this.backupKeybinds);
				FluxDispatcher.unsubscribe('EXPERIMENT_OVERRIDE_BUCKET', this.backupExperiments);
				
				for (const event of AccessiblityEvents) {
					FluxDispatcher.unsubscribe(event, this.backupAccessibility);
				}
				
				for (const event of VoiceEvents) {
					FluxDispatcher.unsubscribe(event, this.backupVoice);
				}
				
				for (const event of NotificationEvents) {
					FluxDispatcher.unsubscribe(event, this.backupNotifications);
				}
			}
			
			backupKeybinds() {
				const keybinds = this.keybinds.getState();
				BdApi.saveData(config.info.name, "keybinds", keybinds);
			}
			
			backupAccessibility() {
				const accessibility = this.accessibility.getState();
				BdApi.saveData(config.info.name, "accessibility", accessibility);
			}
			
			backupNotifications() {
				const notifications = this.notifications.getState();
				BdApi.saveData(config.info.name, "notifications", notifications);
			}
			
			backupExperiments() {
				const experiments = this.experiments.getSerializedState()?.experimentOverrides;
				BdApi.saveData(config.info.name, "experiments", experiments);
			}
			
			backupVoice() {
				const voice = this.voice.getState()?.settingsByContext;
				BdApi.saveData(config.info.name, "voice", voice);
			}
			
			backupSettings() {
				this.backupVoice();
				this.backupKeybinds();
				this.backupExperiments();
				this.backupAccessibility();
				this.backupNotifications();
			}
			
			restore() {
				this.didRestore = true;
				this.restoreVoice();
				this.restoreKeybinds();
				this.restoreExperiments();
				this.restoreAccessibility();
				this.restoreNotifications();
			}
			
			restoreKeybinds() {
				const backup = BdApi.loadData(config.info.name, "keybinds");
				if (!backup) return void this.backupKeybinds();
				
				const store = {
					_version: 2,
					_state: backup
				};
				
				this.storage.impl.set('keybinds', store);
				this.keybinds.initialize(store._state);
			}
			
			restoreExperiments() {
				const backup = BdApi.loadData(config.info.name, "experiments");
				if (!backup) return void this.backupExperiments();
				
				// what the fuck discord...? you can't even spell experiments??
				this.storage.impl.set('exerimentOverrides', backup);
				this.experiments.initialize(backup);
			}
			
			restoreVoice() {
				const backup = BdApi.loadData(config.info.name, "voice");
				if (!backup) return void this.backupVoice();
				
				this.storage.impl.set('MediaEngineStore', backup);
				this.voice.initialize(backup);
			}
			
			restoreAccessibility() {
				const backup = BdApi.loadData(config.info.name, "accessibility");
				if (!backup) return void this.backupAccessibility();
				
				const store = {
					_version: 7,
					_state: backup
				};
				
				this.storage.impl.set('AccessibilityStore', store);
				this.accessibility.initialize(store._state);
			}
			
			restoreNotifications() {
				const backup = BdApi.loadData(config.info.name, "notifications");
				if (!backup) return void this.backupNotifications();
				
				const store = {
					_version: 1,
					_state: backup
				};
				
				this.storage.impl.set('notifications', store);
				this.notifications.initialize(store._state);
			}
			
		};
	
	return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
