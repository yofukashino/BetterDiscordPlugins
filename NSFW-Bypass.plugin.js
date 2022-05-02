/**
 * @name NSFW-Bypass
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 0.2
 * @description Bypass nsfw age restriction
 * @website https://wife-ruby.ml
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/NSFW-Bypass.plugin.js
 */
module.exports = (() => {
	const config = {
		info: {
			name: "NSFW-Bypass",
			authors: [
				{
					name: "Ahlawat",
					discord_id: "887483349369765930",
					github_username: "Tharki-God",
				},
			],
			version: "0.2",
			description:
				"Bypass nsfw age restriction",
			github: "https://github.com/Tharki-God/BetterDiscordPlugins",
			github_raw:
				"https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/NSFW-Bypass.plugin.js",
		},
		main: "NSFW-Bypass.plugin.js",
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
				return class FakeNitro extends Plugin {
					onStart() {
						const user = ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser();
						if (!user) return;						
						this.orginal = user.nsfwAllowed;
						user.nsfwAllowed = true;
					}
					onStop() {
						const user = ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser();
						if (!user) return;
						user.nsfwAllowed = this.orginal;
					}
				};
			};
			return plugin(Plugin, Api);
		})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
