import ChannelAddonManager from "./channel-addon-manager";

export default class AddonManager {
    constructor(bot) {
        this.bot = bot;

        this.channelManagerMap = new Map();//<Channel, ChannelAddonManager>
    }

    get Bot() {
        return this.bot;
    }

    getChannelAddonManager(channel) {
        if (this.channelManagerMap.has(channel))
            return this.channelManagerMap.get(channel);

        let addonManager = new ChannelAddonManager(channel, this);

        this.channelManagerMap.set(channel, addonManager);

        return addonManager;
    }
}