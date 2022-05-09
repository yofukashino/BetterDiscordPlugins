/**
	* @name FakeDeafen
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 0.2.3
	* @description FakeDefen to Trick your Friends
	* @website https://wife-ruby.ml
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js
*/
module.exports = (() => {
	const config = {
		info: {
			name: "FakeDeafen",
			authors: [
				{
					name: "Ahlawat",
					discord_id: "887483349369765930",
					github_username: "Tharki-God",
				},
			],
			version: "0.2.3",
			description:
			"FakeDefen to Trick your Friends",
			github: "https://github.com/Tharki-God/BetterDiscordPlugins",
			github_raw:
			"https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js",
		},changelog: [
			{
				title: "v0.2.3",
				items: [
					"Easier To use Now"
				]
			},

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
								if (error)
								return require("electron").shell.openExternal(
									"https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
								);
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
	: (([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
			const { Patcher, DiscordModules, Settings, PluginUtilities } = Api;
			return class FakeDeafen extends Plugin {
				onStart() {
	if (!BdApi.findModuleByProps('isDeaf').isSelfMute() && !BdApi.findModuleByProps('isDeaf').isSelfDeaf()) { 
		BdApi.findModuleByProps("toggleSelfDeaf").toggleSelfDeaf();
	BdApi.alert("Deafen yourself Dumb Bitch! (^人^)",["You Need to Deafen/Mute yourself before enabling this plugin","This will help you retain that.", "Do it yourself from next time, I deafened You this time"])
		
}
					var text = new TextDecoder("utf-8");					
					WebSocket.prototype.original = WebSocket.prototype.send;
					WebSocket.prototype.send = function(data) {
						if (Object.prototype.toString.call(data) === "[object ArrayBuffer]") {
							if (text.decode(data).includes("self_deaf")) {
								data = data.replace('"self_mute":false', 'NiceOneDiscord');								
							}
						}
						WebSocket.prototype.original.apply(this, [data]);
					}
					BdApi.showConfirmationModal("Less go. Nyaa~", 
    [`Now stop plugin!.`,`You can't join any other voice channels until the plugin is on.`,`For that you will have to Reload discord after disabling the plugin!`],
    {
        danger: true,
        confirmText: "Disable Plugin Now",
        cancelText: "I will do it later",
		onConfirm: () => {
              BdApi.Plugins.disable("FakeDeafen")
            }
    
    }
);
				}
				onStop() {
			
	
					BdApi.showConfirmationModal("See you Later. UwU", 
    [
        `You Disabled the Plugin,`,`So Wanna Reload discord?`
    ],
    {
        danger: true,
        confirmText: "Reload discord",
        cancelText: "I will do it later",
		onConfirm: () => {
              window.location.reload()
            }
    
    }
);
					
				}
			};
		};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
