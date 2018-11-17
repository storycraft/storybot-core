export default class ChannelAddonManager {
    constructor(channel, addonManager) {
        this.channel = channel;
        this.addonManager = addonManager;

        this.addonList = [];
    }

    get Channel() {
        return this.channel;
    }

    get AddonManager() {
        return this.addonManager;
    }

    get Bot() {
        return this.AddonManager.bot;
    }

    get AddonList() {
        return this.addonList;
    }
}